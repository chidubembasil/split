import { Transform } from 'class-transformer';
import { IsArray,  IsNotEmpty, IsNumber, IsString } from "class-validator"

// multipart sends a single value as a plain string, not an array
const toArray = ({ value }: { value: unknown }) =>
    value === undefined || Array.isArray(value) ? value : [value];

export class CreateUploadDto {
    @Transform(toArray)
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    name: string[]


    @Transform(toArray)
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    price : string[]


    @IsString()
    @IsNotEmpty()
    description: string

    @IsNumber()
    @IsNotEmpty()
    quantity: number


}