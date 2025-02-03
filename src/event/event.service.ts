import { Repository } from "typeorm";
import { Event } from "@/event/entity/event.entity";
import { SqlLiteDataSource } from "@/config/database.config";
import { CreateEventDto } from "@/event/dto/create-event.dto";
import { BookEventRequestDto, BookEventResponseDto } from "./dto/book-event.dto";
import { WaitingListService } from "@/waiting-list/waiting-list.service";

export class EventService {
    private eventRepository: Repository<Event>;
    private waitingListService: WaitingListService;

    constructor() {
        this.eventRepository = SqlLiteDataSource.getRepository(Event);
        this.waitingListService = new WaitingListService();
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

    async bookEvent(bookEventDto: BookEventRequestDto): Promise<BookEventResponseDto> {
        try {
            const event = await this.eventRepository.findOne({ where: { id: bookEventDto.eventId } });
            if (!event) {
                throw new Error("Event not found");
            }

            if (event.availableTickets > 0 && event.availableTickets >= bookEventDto.ticketCount) {
                event.availableTickets -= bookEventDto.ticketCount;
                await this.eventRepository.save(event);
                return {
                    status: {
                        isBooked: true,
                        message: "Event booked successfully",
                    },
                    data: event,
                };
            }

            await this.waitingListService.addToWaitingList(bookEventDto);
            return {
                status: {
                    isBooked: false,
                    message: "Event is sold out. Added to waiting list.",
                },
                data: event,
            };
        } catch (error) {
            console.error("Event Booking error:", error);
            throw error;
        }
    }
}
