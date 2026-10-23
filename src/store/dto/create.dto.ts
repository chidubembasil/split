import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreateStoreDto {

    @ApiProperty({ example: 'My Store' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Store description' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    accountName: string;

    @ApiProperty({ example: '1234567890' })
    @IsNotEmpty()
    @IsString()
    accountNumber: string;

    @ApiProperty({ example: 'Bank Name' })
    @IsNotEmpty()
    @IsString()
    bank: string;

    @ApiProperty({ type: [String], example: ['Rule 1', 'Rule 2'] })
    @IsArray()
    @IsString({ each: true })
    rules: string[];

}
