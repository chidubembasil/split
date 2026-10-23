import { IsNotEmpty, IsString } from "class-validator"


export class CreateDashboardDto {
    @IsString()
    @IsNotEmpty()
    prompt: string
    
}
