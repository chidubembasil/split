import { Memory } from "@mastra/memory"
import { storage } from "../storage/catalog-storage.js"

export const catalogMemory = new Memory({
    storage: storage,

    options:{
        lastMessages: 50
    }
})