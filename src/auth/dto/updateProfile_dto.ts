
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Currency } from '../../generated/prisma/enums.js';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name?: string;

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
