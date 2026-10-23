import { PartialType } from '@nestjs/swagger';
import { CreateGenerateUrlDto } from './create-generate-url.dto.js';

export class UpdateGenerateUrlDto extends PartialType(CreateGenerateUrlDto) {}
