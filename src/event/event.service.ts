import { Repository } from "typeorm";
import { Event } from "@/event/entity/event.entity";
import { SqlLiteDataSource } from "@/config/database.config";
import { CreateEventDto } from "@/event/dto/create-event.dto";
import { BookEventRequestDto, BookEventResponseDto } from "./dto/book-event.dto";
import { WaitingListService } from "@/waiting-list/waiting-list.service";
import { RedisSource } from "@/config/redis.config";
import { CancelBookingRequestDto } from "@/event/dto/cancel-event.dto";
import { Booking } from "@/event/entity/booking.entity";

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
                
                const booking = new Booking();
                booking.eventid = bookEventDto.eventId;
                booking.email = bookEventDto.email;
                booking.ticketCount = bookEventDto.ticketCount;
                booking.totalPrice = bookEventDto.ticketCount * event.price;

                await queryRunner.manager.save(booking);
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

    async cancelBooking(cancelEventDto: CancelBookingRequestDto): Promise<void> {
        const lockKey = `event:${cancelEventDto.bookingId}:lock`;
        const queryRunner = this.eventRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
    
        try {
            const lockAcquired = await RedisSource.set(lockKey, 'locked', 'EX', 10, 'NX');
            if (!lockAcquired) {
                throw new Error("Event is currently being modified by another user");
            }
    
            const booking = await queryRunner.manager.findOne(Booking, {
                where: { id: cancelEventDto.bookingId },
                relations: ['event'],
            });

            if (!booking) {
                throw new Error("Booking not found");
            }

            const event = booking.event;
            event.availableTickets += booking.ticketCount;

            await queryRunner.manager.remove(booking);
            await queryRunner.manager.save(event);

            const waitingListEntry = await this.waitingListService.getFirstWaitingListEntry(event.id);
            if (waitingListEntry) {
                event.availableTickets -= waitingListEntry.ticketCount;

                const booking = new Booking();
                booking.eventid = event.id;
                booking.email = waitingListEntry.email;
                booking.ticketCount = waitingListEntry.ticketCount;
                booking.totalPrice = waitingListEntry.ticketCount * event.price;

                await queryRunner.manager.save(event);
                await queryRunner.manager.remove(waitingListEntry);
                await queryRunner.manager.save(booking);
            }

            await queryRunner.commitTransaction();    
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Booking Cancellation error:", error);
            throw error;
        } finally {
            await RedisSource.del(lockKey);
            await queryRunner.release();
        }
    }

    async getStatus(eventId: number): Promise<Event> {
        try {
            const event = await this.eventRepository.findOne({
                where: { id: eventId },
                relations: ['bookings', 'waitingList']
            });

            if (!event) {
                throw new Error("Event not found");
            }

            return event;
        } catch (error) {
            console.error("Get Event Status error:", error);
            throw error;
        }
    }
}
