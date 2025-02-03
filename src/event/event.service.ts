import { Repository } from "typeorm";
import { Event } from "@/event/entities/event.entity";
import { SqlLiteDataSource } from "@/config/database.config";
import { CreateEventDto } from "@/event/dto/create-event.dto";
import { BookEventRequestDto, BookEventResponseDto } from "./dto/book-event.dto";

export class EventService {
    private eventRepository: Repository<Event>;

    constructor() {
        this.eventRepository = SqlLiteDataSource.getRepository(Event);
    }

    async initialize(event: CreateEventDto) {
        try {
            const defaultEvent = this.eventRepository.create(event);
            const savedEvent = await this.eventRepository.save(defaultEvent);
            return { id: savedEvent.id };
        } catch (error) {
            console.error("Event Initialization error:", error);
            throw error;
        }
    }

    async bookEvent(eventDto: BookEventRequestDto): Promise<BookEventResponseDto> {
        try {
          // implement the logic
        } catch (error) {
            console.error("Event Booking error:", error);
            throw error;
        }
    }
}
