import { IsArray, IsNotEmpty, IsString } from "class-validator";


export class CreateStoreDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    accountName: string;

    @IsNotEmpty()
    @IsString()
    accountNumber: string;

    @IsNotEmpty()
    @IsString()
    bank: string;

    @IsArray()
    @IsString({ each: true })
    rules: string[];

}
