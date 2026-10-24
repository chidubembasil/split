import { Agent } from "@mastra/core/agent";
import type { UploadService } from "../../../upload/upload.service.js";
type UploadFiles = Parameters<UploadService["create"]>[1];
type PersonalAgentDependencies = {
    catalog: UploadService;
    userId: string;
    profileId: string;
    storeId: string;
    profile: {
        name: string;
        businessName: string;
    };
    files?: UploadFiles;
};
export declare function createPersonalAgent({ catalog, userId, profileId, storeId, profile, files, }: PersonalAgentDependencies): Agent<"personal-agent", import("@mastra/core/agent").ToolsInput, undefined, any, import("@mastra/core/agent").AgentEditorConfig | undefined>;
export {};
