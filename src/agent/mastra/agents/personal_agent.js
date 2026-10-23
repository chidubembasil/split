import { Agent } from "@mastra/core/agent";
import { personalAgentInstruction } from "../instructions/personal_instruction.js";
import { CatalogAgent } from "./catalog_agent.js";
export function createPersonalAgent({ catalog, userId, profileId, storeId, profile, files = [], }) {
    const catalogAgent = CatalogAgent(catalog, userId, profileId, files);
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
    });
}
//# sourceMappingURL=personal_agent.js.map