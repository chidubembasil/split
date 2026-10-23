import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDto {
    @ApiProperty({ example: 'John Doe', minLength: 3 })
    @IsString()
    @IsNotEmpty()
    @Length(3)
    name: string

    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({ example: 'password123', minLength: 6, maxLength: 20 })
    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    password: string

    @ApiProperty({ required: false, example: true })
    @IsBoolean()
    rememberMe?: boolean 
}