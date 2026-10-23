import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { CreateStoreDto } from './dto/create.dto.js';
import { UpdateStoreDto } from './dto/update.dto.js';

@Injectable()
export class StoreService {
    constructor(
        private readonly db: DatabaseService,
    ){}

    async createStore(data: CreateStoreDto, userId: string) {
        const existing = await this.db.store.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (existing) {
            throw new ConflictException('You already have a store');
        }

        return this.db.store.create({
            data: {
                name: data.name,
                description: data.description,
                accountName: data.accountName,
                accountNumber: data.accountNumber,
                bank: data.bank,
                rules: data.rules,
                userId,
            },
        });
    }

    async findAll(userId: string) {
        return this.db.store.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string, userId: string) {
        const store = await this.db.store.findFirst({
            where: { id, userId },
        });

        if (!store) {
            throw new NotFoundException('Store not found');
        }

        return store;
    }

    async updateStore(id: string, userId: string, data: UpdateStoreDto) {
        await this.findOne(id, userId);

        return this.db.store.update({
            where: { id },
            data,
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);
        await this.db.store.delete({ where: { id } });

        return { deleted: true };
    }

}
