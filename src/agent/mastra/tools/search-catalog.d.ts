import type { UploadService } from "../../../upload/upload.service.js";
export declare function SearchCatalogFunction(catalog: UploadService): import("@mastra/core/tools").Tool<{
    name: string;
}, {
    id: string;
    name: string;
    description: string;
    price: string;
    currency: "NAIRA" | "DOLLAR" | "POUNDS" | "EURO" | "CANADIAN_DOLLAR" | "CEDIS";
    fileUrl: string;
}, unknown, unknown, import("@mastra/core/tools").ToolExecutionContext<unknown, unknown, unknown>, "catalog-tool", unknown>;
