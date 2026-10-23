import { Transform } from 'class-transformer';
import { IsArray,  IsNotEmpty, IsNumber, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

// multipart sends a single value as a plain string, not an array
const toArray = ({ value }: { value: unknown }) =>
    value === undefined || Array.isArray(value) ? value : [value];

export class CreateUploadDto {
    @ApiProperty({ type: [String] })
    @Transform(toArray)
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    name: string[]


    @ApiProperty({ type: [String] })
    @Transform(toArray)
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    price : string[]


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty({ type: Number })
    @Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
    @IsNumber()
    @IsNotEmpty()
    quantity: number


}