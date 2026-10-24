import { IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";

export class CreateDashboardDto {

    @ApiProperty({ example: 'Prompt' })
    @IsString()
    @IsNotEmpty()
    prompt: string
    
}
