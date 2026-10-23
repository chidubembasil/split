import { Agent } from "@mastra/core/agent";
import { UploadService } from "../../../upload/upload.service.js";
import type { StoreService } from "../../../store/store.service.js";
import { ReadCatalogFunction } from "../tools/read-catalog-tools.js";
import { catalogAgentInstructions } from "../instructions/catalog_instruction.js";
import { UpdateCatalogFunction } from "../tools/update-catalog-tools.js";
import { CreateCatalogFunction } from "../tools/create-catalog-tools.js";
import { SearchCatalogFunction } from "../tools/search-catalog.js";
import { DeleteCatalogFunction } from "../tools/delete-catalog.js";
import { CreateStoreFunction } from "../tools/create-store-catalog-tools.js";
import { UpdateStoreFunction } from "../tools/update-store-catalog-tools.js";
import { catalogMemory } from "../memory/catalog-memory.js";

type UploadFiles = Parameters<UploadService["create"]>[1];

const TEXT_MODEL = "groq/openai/gpt-oss-120b";
const IMAGE_MODEL = "meta-models/muse-spark-open";

export function CatalogAgent(
  catalog: UploadService,
  store: StoreService,
  userId: string,
  profileId: string,
  storeId: string,
  files: UploadFiles = [],
) {
  return new Agent({
    id: 'catalog-agent',
    name: 'Catalog Agent',
    description: "Turns product photos, or messy text into clean listings, and updates price and stock when the seller says so",
    instructions: catalogAgentInstructions,
    model: files.length > 0 ? IMAGE_MODEL : TEXT_MODEL,
    tools: {
      readCatalog: ReadCatalogFunction(catalog),
      updateCatalog: UpdateCatalogFunction(catalog, userId, profileId),
      searchCatalog: SearchCatalogFunction(catalog),
      deleteCatalog: DeleteCatalogFunction(catalog),
      createCatalog: CreateCatalogFunction(catalog, userId, profileId, files),
      createStore: CreateStoreFunction(store, userId),
      ...(storeId ? { updateStore: UpdateStoreFunction(store, userId, storeId) } : {}),
    },
    memory: catalogMemory
  });
}