import { Agent } from "@mastra/core/agent";
import { personalAgentInstruction } from "../instructions/personal_instruction.js";
import { CatalogAgent } from "./catalog_agent.js";
import type { UploadService } from "../../../upload/upload.service.js";
import type { StoreService } from "../../../store/store.service.js";
import { personalMemory } from "../memory/personal-memory.js";

type UploadFiles = Parameters<UploadService["create"]>[1];

type PersonalAgentDependencies = {
  catalog: UploadService;
  store: StoreService;
  userId: string;
  profileId: string;
  storeId: string;
  profile: {
    name: string;
    businessName: string;
  };
  files?: UploadFiles;
};

export function createPersonalAgent({
  catalog,
  store,
  userId,
  profileId,
  storeId,
  profile,
  files = [],
}: PersonalAgentDependencies) {
  const catalogAgent = CatalogAgent(
    catalog,
    store,
    userId,
    profileId,
    storeId,
    files,
  );

  return new Agent({
    id: "personal-agent",
    name: "Personal Agent",
    instructions: personalAgentInstruction({
      sellerName: profile.name,
      businessName: profile.businessName,
      storeId,
    }),
    model: "openai/gpt-oss-20b",
    agents: {
      catalogAgent,
    },
    memory: personalMemory
  });
}