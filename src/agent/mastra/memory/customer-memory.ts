import { Memory } from "@mastra/memory"
import { storage } from "../storage/customer-storage.js"

export const customerMemory = new Memory({
    storage: storage,

    options:{
        lastMessages: 50
    }
})