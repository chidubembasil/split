import { PartialType } from "@nestjs/mapped-types";
import { CreateStoreDto } from "./create.dto.js";

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
