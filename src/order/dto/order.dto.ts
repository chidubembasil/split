
import { Type } from 'class-transformer';
import {
  ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../../generated/prisma/enums.js';

export class OrderItemDto {
  @IsString() productId: string;
  @IsInt() @Min(1) @Max(100) quantity: number;
}

export class CreateOrderDto {
  @IsString() storeId: string;
  @IsString() @MinLength(2) @MaxLength(80) customerName: string;
  @IsString() @MaxLength(25) customerPhone: string;
  @IsString() @MaxLength(300) deliveryAddress: string;
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(20) @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(80) customerName?: string;
  @IsOptional() @IsString() @MaxLength(25) customerPhone?: string;
  @IsOptional() @IsString() @MaxLength(300) deliveryAddress?: string;
  @IsOptional() @IsArray() @ArrayMinSize(1) @ArrayMaxSize(20) @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items?: OrderItemDto[];
}

export class ListOrdersQueryDto {
  @IsOptional() @IsEnum(OrderStatus) status?: OrderStatus;
  @IsOptional() @IsString() storeId?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit?: number;
}