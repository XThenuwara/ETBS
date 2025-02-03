import { Repository } from "typeorm";
import { Event } from "@/event/entity/event.entity";
import { SqlLiteDataSource } from "@/config/database.config";
import { CreateEventDto } from "@/event/dto/create-event.dto";
import { BookEventRequestDto, BookEventResponseDto } from "./dto/book-event.dto";
import { WaitingListService } from "@/waiting-list/waiting-list.service";
import { RedisSource } from "@/config/redis.config";

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
        const lockKey = `event:${bookEventDto.eventId}:lock`;
        const queryRunner = this.eventRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const event = await queryRunner.manager.findOne(Event, {
                where: { id: bookEventDto.eventId },
                // lock: { mode: "pessimistic_write" },
            });
            // Acquire the Redis lock
            const lockAcquired = await RedisSource.set(lockKey, 'locked', 'EX', 10, 'NX');
            if (!lockAcquired) {
                throw new Error("Event is currently being booked by another user");
            }

            if (!event) {
                throw new Error("Event not found");
            }

            if (event.availableTickets > 0 && event.availableTickets >= bookEventDto.ticketCount) {
                event.availableTickets -= bookEventDto.ticketCount;
                await queryRunner.manager.save(event);
                await queryRunner.commitTransaction();

                return {
                    status: {
                        isBooked: true,
                        message: "Event booked successfully",
                    },
                    data: event,
                };
            }

            await this.waitingListService.addToWaitingList(bookEventDto);
            await queryRunner.commitTransaction();
            return {
                status: {
                    isBooked: false,
                    message: "Event is sold out. Added to waiting list.",
                },
                data: event,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Event Booking error:", error);
            throw error;
        } finally {
            await RedisSource.del(lockKey);
            await queryRunner.release();
        }
    }
}
