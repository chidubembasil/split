import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../generated/prisma/enums.js';
import type { Prisma } from '../generated/prisma/client.js';
import { DatabaseService } from '../database/database.service.js'; // use whatever your UploadService injects as `db`

export type OrderLineInput = { productId: string; quantity: number };
type Tx = Prisma.TransactionClient;

const MAX_LINES = 20;
const MAX_QTY = 100;
const MAX_TOTAL = 2_000_000_000; // Int column limit is about 2.1 billion

const clip = (s: string | undefined, n: number) => (s ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
// 0803..., 803..., and +234803... count as the same number (compares the last 10 digits)
const samePhone = (a: string, b: string) => a.replace(/\D/g, '').slice(-10) === b.replace(/\D/g, '').slice(-10);

const ORDER_SELECT = {
  id: true, CustomerName: true, customerPhone: true, deliveryAddress: true, totalAmount: true, status: true, createdAt: true, storeId: true,
  items: { select: { id: true, productId: true, quantity: true, price: true } },
} as const;

type OrderRow = Prisma.OrderGetPayload<{ select: typeof ORDER_SELECT }>;

@Injectable()
export class OrdersService {
  constructor(private readonly db: DatabaseService) {}

  // ---------------- helpers ----------------
  private validPhone(raw: string) {
    const t = clip(raw, 25);
    const digits = t.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) throw new BadRequestException('That phone number does not look right.');
    return (t.startsWith('+') ? '+' : '') + digits;
  }

  private validName(raw: string) {
    const n = clip(raw, 80);
    if (n.length < 2) throw new BadRequestException("The customer's name is too short.");
    return n;
  }

  private validAddress(raw: string) {
    const a = clip(raw, 300);
    if (a.length < 5) throw new BadRequestException('The delivery address is too short.');
    return a;
  }

  // Product names for display (items only store the product id)
  private async view(rows: OrderRow[]) {
    const ids = [...new Set(rows.flatMap((r) => r.items.map((i) => i.productId)))];
    const products = ids.length
      ? await this.db.upload.findMany({ where: { id: { in: ids } }, select: { id: true, name: true } })
      : [];
    const names = new Map(products.map((p) => [p.id, p.name[0] ?? null]));
    return rows.map((r) => ({
      id: r.id,
      status: r.status,
      storeId: r.storeId,
      customerName: r.CustomerName,
      customerPhone: r.customerPhone,
      deliveryAddress: r.deliveryAddress,
      total: r.totalAmount,
      createdAt: r.createdAt,
      items: r.items.map((i) => ({
        productId: i.productId,
        name: names.get(i.productId) ?? 'Removed product',
        quantity: i.quantity,
        unitPrice: i.price,
        lineTotal: i.price * i.quantity,
      })),
    }));
  }

  private async viewOne(row: OrderRow) {
    return (await this.view([row]))[0];
  }

  // Prices come from the database, never from the caller
  private async priceLines(storeId: string, lines: OrderLineInput[]) {
    if (!lines?.length) throw new BadRequestException('Add at least one item.');
    if (lines.length > MAX_LINES) throw new BadRequestException(`An order can have at most ${MAX_LINES} different items.`);

    const merged = new Map<string, number>();
    for (const l of lines) {
      if (!l.productId || !Number.isInteger(l.quantity) || l.quantity < 1 || l.quantity > MAX_QTY) {
        throw new BadRequestException(`Each quantity must be a whole number from 1 to ${MAX_QTY}.`);
      }
      merged.set(l.productId, (merged.get(l.productId) ?? 0) + l.quantity);
    }
    for (const q of merged.values()) if (q > MAX_QTY) throw new BadRequestException(`At most ${MAX_QTY} of one item per order.`);

    const products = await this.db.upload.findMany({
      where: { id: { in: [...merged.keys()] }, storeId },
      select: { id: true, name: true, price: true },
    });
    if (products.length !== merged.size) {
      throw new BadRequestException('One or more products were not found in this store. Search the catalog and use the product id it returns.');
    }

    const priced = products.map((p) => {
      const unit = Math.round(Number(p.price[0])); // whole units of the seller's currency
      if (!Number.isFinite(unit) || unit <= 0) throw new BadRequestException(`"${p.name[0] ?? 'This product'}" has no valid price. Ask the seller.`);
      return { productId: p.id, name: p.name[0] ?? 'Product', quantity: merged.get(p.id)!, price: unit };
    });
    const total = priced.reduce((s, p) => s + p.price * p.quantity, 0);
    if (total > MAX_TOTAL) throw new BadRequestException('The order total is too large.');
    return { priced, total };
  }

  // Reserve stock inside a transaction. If any line fails, everything rolls back.
  private async reserve(tx: Tx, storeId: string, lines: { productId: string; quantity: number; name?: string }[]) {
    for (const l of lines) {
      const r = await tx.upload.updateMany({
        where: { id: l.productId, storeId, quantity: { gte: l.quantity } },
        data: { quantity: { decrement: l.quantity } },
      });
      if (r.count === 0) throw new BadRequestException(`Not enough stock${l.name ? ` for "${l.name}"` : ''}.`);
    }
  }

  private async release(tx: Tx, storeId: string, lines: { productId: string; quantity: number }[]) {
    for (const l of lines) {
      // a deleted product simply matches nothing
      await tx.upload.updateMany({ where: { id: l.productId, storeId }, data: { quantity: { increment: l.quantity } } });
    }
  }

  private async getOwned(userId: string, orderId: string) {
    const o = await this.db.order.findFirst({ where: { id: orderId, store: { userId } }, select: ORDER_SELECT });
    if (!o) throw new NotFoundException('Order not found');
    return o;
  }

  private async getForBuyer(storeId: string, orderId: string, phone: string) {
    const o = await this.db.order.findFirst({ where: { id: orderId, storeId }, select: ORDER_SELECT });
    // the same answer for "no such order" and "wrong phone", so ids cannot be probed
    if (!o || !samePhone(o.customerPhone, phone)) throw new NotFoundException('Order not found');
    return o;
  }

  private async paymentDetails(storeId: string) {
    const s = await this.db.store.findUnique({ where: { id: storeId }, select: { bank: true, accountName: true, accountNumber: true } });
    return s ? { bank: s.bank, accountName: s.accountName, accountNumber: s.accountNumber } : null;
  }

  // ---------------- CREATE ----------------
  async createForStore(storeId: string, dto: { items: OrderLineInput[]; customerName: string; customerPhone: string; deliveryAddress: string }) {
    const name = this.validName(dto.customerName);
    const phone = this.validPhone(dto.customerPhone);
    const address = this.validAddress(dto.deliveryAddress);
    const { priced, total } = await this.priceLines(storeId, dto.items);

    const order = await this.db.$transaction(async (tx) => {
      await this.reserve(tx, storeId, priced);
      return tx.order.create({
        data: {
          storeId, CustomerName: name, customerPhone: phone, deliveryAddress: address, totalAmount: total, status: OrderStatus.PENDING,
          items: { create: priced.map((p) => ({ productId: p.productId, quantity: p.quantity, price: p.price })) },
        },
        select: ORDER_SELECT,
      });
    });
    return { order: await this.viewOne(order), payment: await this.paymentDetails(storeId) };
  }

  // Seller creates an order by hand (dashboard)
  async createForSeller(userId: string, dto: { storeId: string; items: OrderLineInput[]; customerName: string; customerPhone: string; deliveryAddress: string }) {
    const store = await this.db.store.findFirst({ where: { id: dto.storeId, userId }, select: { id: true } });
    if (!store) throw new NotFoundException('Store not found');
    return this.createForStore(store.id, dto);
  }

  // ---------------- READ ----------------
  async list(userId: string, q: { status?: OrderStatus; storeId?: string; page?: number; limit?: number }) {
    const limit = Math.min(Math.max(q.limit ?? 20, 1), 50);
    const page = Math.max(q.page ?? 1, 1);
    const where = {
      store: { userId, ...(q.storeId ? { id: q.storeId } : {}) },
      ...(q.status ? { status: q.status } : {}),
    };
    const [rows, total] = await Promise.all([
      this.db.order.findMany({ where, select: ORDER_SELECT, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.db.order.count({ where }),
    ]);
    return { page, limit, total, orders: await this.view(rows) };
  }

  async getForSeller(userId: string, orderId: string) {
    return { order: await this.viewOne(await this.getOwned(userId, orderId)) };
  }

  async readForBuyer(storeId: string, orderId: string, phone: string) {
    const order = await this.viewOne(await this.getForBuyer(storeId, orderId, phone));
    return { order, payment: order.status === OrderStatus.PENDING ? await this.paymentDetails(storeId) : null };
  }

  // ---------------- UPDATE ----------------
  // Shared by seller and buyer. Items can only change while the order is pending.
  private async applyUpdate(order: OrderRow, dto: { customerName?: string; customerPhone?: string; deliveryAddress?: string; items?: OrderLineInput[] }) {
    if (order.status === OrderStatus.CANCELLED) throw new BadRequestException('A cancelled order cannot be changed.');
    if (dto.items && order.status !== OrderStatus.PENDING) throw new BadRequestException('Items can only be changed while the order is pending.');

    const data: Prisma.OrderUpdateInput = {};
    if (dto.customerName) data.CustomerName = this.validName(dto.customerName);
    if (dto.customerPhone) data.customerPhone = this.validPhone(dto.customerPhone);
    if (dto.deliveryAddress) data.deliveryAddress = this.validAddress(dto.deliveryAddress);
    const priced = dto.items ? await this.priceLines(order.storeId, dto.items) : null;
    if (priced) data.totalAmount = priced.total;
    if (!Object.keys(data).length) throw new BadRequestException('Nothing to update.');

    const updated = await this.db.$transaction(async (tx) => {
      if (priced) {
        const still = await tx.order.updateMany({ where: { id: order.id, status: OrderStatus.PENDING }, data: {} });
        if (still.count === 0) throw new BadRequestException('The order is no longer pending.');
        await this.release(tx, order.storeId, order.items); // give back the old reservation
        await this.reserve(tx, order.storeId, priced.priced); // take the new one
        await tx.orderItem.deleteMany({ where: { orderId: order.id } });
        data.items = { create: priced.priced.map((p) => ({ productId: p.productId, quantity: p.quantity, price: p.price })) };
      }
      return tx.order.update({ where: { id: order.id }, data, select: ORDER_SELECT });
    });
    return { order: await this.viewOne(updated) };
  }

  async updateForSeller(userId: string, orderId: string, dto: { customerName?: string; customerPhone?: string; deliveryAddress?: string; items?: OrderLineInput[] }) {
    return this.applyUpdate(await this.getOwned(userId, orderId), dto);
  }

  async updateForBuyer(storeId: string, orderId: string, phone: string, dto: { customerName?: string; customerPhone?: string; deliveryAddress?: string; items?: OrderLineInput[] }) {
    const order = await this.getForBuyer(storeId, orderId, phone);
    if (order.status !== OrderStatus.PENDING) throw new BadRequestException('This order can no longer be changed. Please contact the seller.');
    return this.applyUpdate(order, dto);
  }

  async markPaid(userId: string, orderId: string) {
    const order = await this.getOwned(userId, orderId);
    const r = await this.db.order.updateMany({ where: { id: order.id, status: OrderStatus.PENDING }, data: { status: OrderStatus.PAID } });
    if (r.count === 0) throw new BadRequestException(`Only a pending order can be marked as paid (this one is ${order.status.toLowerCase()}).`);
    return { order: await this.viewOne(await this.getOwned(userId, orderId)) };
  }

  // ---------------- CANCEL (gives the stock back) ----------------
  private async cancelOrder(order: OrderRow, allowed: OrderStatus[]) {
    await this.db.$transaction(async (tx) => {
      const r = await tx.order.updateMany({ where: { id: order.id, status: { in: allowed } }, data: { status: OrderStatus.CANCELLED } });
      if (r.count === 0) throw new BadRequestException(`This order is ${order.status.toLowerCase()} and cannot be cancelled this way.`);
      await this.release(tx, order.storeId, order.items); // only runs when the status change succeeded, so stock is returned once
    });
    const fresh = await this.db.order.findUniqueOrThrow({ where: { id: order.id }, select: ORDER_SELECT });
    return { order: await this.viewOne(fresh) };
  }

  // A paid order can be cancelled by the seller. Refunding the buyer is up to the seller.
  async cancelForSeller(userId: string, orderId: string) {
    return this.cancelOrder(await this.getOwned(userId, orderId), [OrderStatus.PENDING, OrderStatus.PAID]);
  }

  async cancelForBuyer(storeId: string, orderId: string, phone: string) {
    return this.cancelOrder(await this.getForBuyer(storeId, orderId, phone), [OrderStatus.PENDING]);
  }

  // ---------------- DELETE ----------------
  // Only cancelled orders can be deleted, so paid or pending records are never lost by accident.
  async remove(userId: string, orderId: string) {
    const order = await this.getOwned(userId, orderId);
    await this.db.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { orderId: order.id } }); // OrderItem has no cascade in your schema
      const r = await tx.order.deleteMany({ where: { id: order.id, status: OrderStatus.CANCELLED } });
      if (r.count === 0) throw new BadRequestException('Only a cancelled order can be deleted. Cancel it first.');
    });
    return { deleted: true };
  }
}