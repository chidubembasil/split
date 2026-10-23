import { PartialType } from "@nestjs/swagger";
import { CreateStoreDto } from "./create.dto.js";

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
