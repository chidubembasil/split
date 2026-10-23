import type { UploadService } from "../../../upload/upload.service.js";
type UploadFiles = Parameters<UploadService["create"]>[1];
export declare function UpdateCatalogFunction(catalog: UploadService, userId: string, profileId: string, files?: UploadFiles): import("@mastra/core/tools").Tool<{
    id: string;
    name: string;
    description: string;
    price: string;
    quantity: number;
}, unknown, unknown, unknown, import("@mastra/core/tools").ToolExecutionContext<unknown, unknown, unknown>, "catalog-tool", unknown>;
export {};
