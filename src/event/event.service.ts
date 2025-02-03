
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { SqlLiteDataSource } from '@/config/database.config';
import { CreateEventDto } from './dto/create-event.dto';

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
            console.error('Event Initialization error:', error);
            throw error;
        }
    }
}