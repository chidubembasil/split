
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '../../generated/prisma/enums.js';

export class UpdateProfileDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    image?: string;
    

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    uploadName?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    description?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    price?: string[];

    @IsOptional()
    @IsEnum(Currency)
    currency?: Currency;
}
