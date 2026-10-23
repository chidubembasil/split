import { Memory } from "@mastra/memory"
import { storage } from "../storage/personal-storage.js"

export const personalMemory = new Memory({
    storage: storage,

    options:{
        lastMessages: 50
    }
})