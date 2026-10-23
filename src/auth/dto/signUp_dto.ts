import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateDto {
    @IsString()
    @IsNotEmpty()
    @Length(3)
    name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    password: string

    @IsBoolean()
    rememberMe?: boolean 
}