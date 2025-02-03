import { Repository } from "typeorm";
import { SqlLiteDataSource } from "@/config/database.config";
import { WaitingList } from "@/waiting-list/entity/waitingList.entity";
import { BookEventRequestDto } from "@/event/dto/book-event.dto";

export class WaitingListService {
    private waitingListRepository: Repository<WaitingList>;

    constructor() {
        this.waitingListRepository = SqlLiteDataSource.getRepository(WaitingList);
    }

    async addToWaitingList(bookEventDto: BookEventRequestDto) {
        const waiting = new WaitingList();
        waiting.email = bookEventDto.email
        waiting.eventId = bookEventDto.eventId;
        waiting.ticketCount = bookEventDto.ticketCount;
        await this.waitingListRepository.save(waiting);
        return waiting;
    }

    async getFirstWaitingListEntry(eventId: number) {
        return this.waitingListRepository.findOne({
            where: { eventId },
            order: { createdAt: "DESC" }
        });
    }
}
