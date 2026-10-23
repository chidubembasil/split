import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDto } from './dto/create_dto.js';
import { createPersonalAgent } from '../agent/mastra/agents/personal_agent.js';
import { UploadService } from '../upload/upload.service.js';
import { StoreService } from '../store/store.service.js';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class HomeService {
    constructor(
        private readonly upload: UploadService,
        private readonly store: StoreService,
        private readonly db: DatabaseService
    ){}


    async UserInput(dto: CreateDto, id: string){
        const user = await this.db.user.findUnique({
            where: { id },
            select: {
                name: true,
                profileId: true,
                store: { select: { id: true, name: true }, take: 1 },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const store = user.store[0];

        const agent = createPersonalAgent({
            catalog: this.upload,
            store: this.store,
            userId: id,
            profileId: user.profileId,
            storeId: store?.id ?? '',
            profile: {
                name: user.name,
                businessName: store?.name ?? 'your business',
            },
        });

        return agent.generate(dto.prompt);
    }
}