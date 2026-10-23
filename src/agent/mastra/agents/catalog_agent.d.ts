import { Agent } from "@mastra/core/agent";
import type { UploadService } from "../../../src/upload/upload.service.js";
type UploadFiles = Parameters<UploadService["create"]>[1];
export declare function CatalogAgent(catalog: UploadService, userId: string, profileId: string, files?: UploadFiles): Agent<"catalog-agent", {
    readCatalog: import("@mastra/core/tools").Tool<{
        id: string;
    }, {
        id: string;
        name: string;
        description: string;
        price: string;
        currency: "NAIRA" | "DOLLAR" | "POUNDS" | "EURO" | "CANADIAN_DOLLAR" | "CEDIS";
        fileUrl: string;
    }, unknown, unknown, import("@mastra/core/tools").ToolExecutionContext<unknown, unknown, unknown>, "catalog-tool", unknown>;
    updateCatalog: import("@mastra/core/tools").Tool<{
        id: string;
        name: string;
        description: string;
        price: string;
        quantity: number;
    }, unknown, unknown, unknown, import("@mastra/core/tools").ToolExecutionContext<unknown, unknown, unknown>, "catalog-tool", unknown>;
    searchCatalog: import("@mastra/core/tools").Tool<{
        name: string;
    }, {
        id: string;
        name: string;
        description: string;
        price: string;
        currency: "NAIRA" | "DOLLAR" | "POUNDS" | "EURO" | "CANADIAN_DOLLAR" | "CEDIS";
        fileUrl: string;
    }, unknown, unknown, import("@mastra/core/tools").ToolExecutionContext<unknown, unknown, unknown>, "catalog-tool", unknown>;
    deleteCatalog: import("@mastra/core/tools").Tool<{
        id: string;
    }, unknown, unknown, unknown, import("@mastra/core/tools").ToolExecutionContext<unknown, unknown, unknown>, "catalog-tool", unknown>;
    createCatalog: import("@mastra/core/tools").Tool<{
        name: string;
        description: string;
        price: string;
        quantity: number;
    }, unknown, unknown, unknown, import("@mastra/core/tools").ToolExecutionContext<unknown, unknown, unknown>, "catalog-tool", unknown>;
}, undefined, any, import("@mastra/core/agent").AgentEditorConfig | undefined>;
export {};
