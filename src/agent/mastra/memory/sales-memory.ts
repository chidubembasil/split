import { Memory } from "@mastra/memory"
import { storage } from "../storage/sales-storage.js"

export const salesMemory = new Memory({
    storage: storage,

    options:{
        lastMessages: 50
    }
})