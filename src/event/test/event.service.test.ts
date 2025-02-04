import { Event } from "@/event/entity/event.entity";
import { SqlLiteDataSource } from "@/config/database.config";
import { CreateEventDto } from "@/event/dto/create-event.dto";
import { EventService } from "@/event/event.service";
import { BookEventRequestDto } from "@/event/dto/book-event.dto";
import { Repository, Connection, QueryRunner, EntityManager } from "typeorm";
import { RedisSource } from "@/config/redis.config";
import { CancelBookingRequestDto } from "@/event/dto/cancel-event.dto";
import { Booking } from "@/event/entity/booking.entity";

describe("EventService", () => {
    let service: EventService;
    let mockConnection: jest.Mocked<Connection>;
    let mockQueryRunner: jest.Mocked<QueryRunner>;
    let mockEntityManager: jest.Mocked<EntityManager>;
    let mockRedisSource: jest.Mocked<typeof RedisSource>;
    let mockEventRepository: jest.Mocked<Repository<Event>>;

    const createEventDto: CreateEventDto = {
        name: "Test Event",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        location: "Test Location",
        totalTickets: 100,
        availableTickets: 100,
        price: 100,
    };

    beforeEach(() => {
        mockEventRepository = {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            manager: {
                connection: {
                    createQueryRunner: jest.fn(() => mockQueryRunner),
                },
                findOne: jest.fn(),
                save: jest.fn(),
            },
        } as unknown as jest.Mocked<Repository<Event>>;

        mockEntityManager = {
            "@instanceof": Symbol(),
            connection: SqlLiteDataSource,
            queryRunner: undefined,
            transaction: jest.fn(),
            query: jest.fn(),
            createQueryBuilder: jest.fn(),
            hasId: jest.fn(),
            getId: jest.fn(),
            create: jest.fn(),
            merge: jest.fn(),
            preload: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            softDelete: jest.fn(),
            recover: jest.fn(),
            count: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            clear: jest.fn(),
            increment: jest.fn(),
            decrement: jest.fn(),
            extend: jest.fn(),
            release: jest.fn(),
        } as unknown as jest.Mocked<EntityManager>;

        mockConnection = {
            createQueryRunner: jest.fn(),
            "@instanceof": Symbol(),
            name: "default",
            options: {},
            isInitialized: true,
            driver: {} as any,
            manager: mockEntityManager,
            isConnected: true,
            subscribers: [],
            migrations: [],
            entities: [],
        } as unknown as jest.Mocked<Connection>;

        mockQueryRunner = {
            connection: SqlLiteDataSource,
            broadcaster: {
                broadcast: jest.fn(),
            },
            isReleased: false,
            isTransactionActive: false,
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: mockEntityManager,
            connect: jest.fn(),
            disconnect: jest.fn(),
            query: jest.fn(),
            hasLock: jest.fn(),
            getLock: jest.fn(),
            releaseLock: jest.fn(),
            stream: jest.fn(),
            initialize: jest.fn(),
        } as unknown as jest.Mocked<QueryRunner>;

        mockConnection.createQueryRunner.mockReturnValue(mockQueryRunner);

        mockRedisSource = {
            set: jest.fn(),
            get: jest.fn(),
        } as unknown as jest.Mocked<typeof RedisSource>;

        jest.spyOn(SqlLiteDataSource, "getRepository").mockReturnValue(mockEventRepository);
        service = new EventService();
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    // Event Initialization
    describe("initialize", () => {
        it("should initialize and save the event successfully", async () => {
            const mockEvent = { id: 1, ...createEventDto } as Event;
            mockEventRepository.create.mockReturnValue(mockEvent);
            mockEventRepository.save.mockResolvedValue(mockEvent);

            const result = await service.initialize(createEventDto);

            expect(mockEventRepository.create).toHaveBeenCalledWith(createEventDto);
            expect(mockEventRepository.save).toHaveBeenCalledWith(mockEvent);
            expect(result).toEqual({ id: 1 });
        });

        it("should handle errors during initialization", async () => {
            const errorMessage = "Database error";
            const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

            mockEventRepository.create.mockReturnValue({} as Event);
            mockEventRepository.save.mockRejectedValue(new Error(errorMessage));

            await expect(service.initialize(createEventDto)).rejects.toThrow(errorMessage);

            expect(consoleErrorSpy).toHaveBeenCalledWith("Event Initialization error:", new Error(errorMessage));

            consoleErrorSpy.mockRestore();
        });

        it("should handle errors if create throws", async () => {
            const errorMessage = "Create Error";
            const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

            mockEventRepository.create.mockImplementation(() => {
                throw new Error(errorMessage);
            });

            await expect(service.initialize(createEventDto)).rejects.toThrow(errorMessage);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Event Initialization error:", new Error(errorMessage));

            consoleErrorSpy.mockRestore();
        });
    });

    // Event Booking
    describe("bookEvent", () => {
        it("should book the event successfully if tickets are available", async () => {
            const bookEventDto: BookEventRequestDto = {
                eventId: 1,
                email: "test@gmail.com",
                ticketCount: 10,
            };

            const mockEvent: Event = {
                id: bookEventDto.eventId,
                name: "Test Event",
                description: "Test Description",
                startDate: new Date(),
                endDate: new Date(),
                location: "Test Location",
                totalTickets: 100,
                price: 100,
                availableTickets: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Event;

            mockRedisSource.set.mockResolvedValue("OK");
            (mockQueryRunner.manager.findOne as jest.Mock).mockResolvedValue(mockEvent);
            (mockQueryRunner.manager.save as jest.Mock).mockResolvedValue({
                ...mockEvent,
                availableTickets: mockEvent.availableTickets - bookEventDto.ticketCount,
            });

            await expect(service.bookEvent(bookEventDto)).resolves.not.toThrow();
            const result = await service.bookEvent(bookEventDto);
            const resultStatus = result.status;
            const resultData = result.data;
            expect(resultStatus).toEqual({
                isBooked: true,
                message: "Event booked successfully",
            });
            expect(resultData).toEqual(
                expect.objectContaining({
                    id: 1,
                    availableTickets: 80,
                })
            );
        });

        it("should add user to waiting list if event is sold out", async () => {
            const bookEventDto: BookEventRequestDto = {
                eventId: 1,
                email: "test@gmail.com",
                ticketCount: 10,
            };

            const mockEvent: Event = {
                id: bookEventDto.eventId,
                name: "Test Event",
                description: "Test Description",
                startDate: new Date(),
                endDate: new Date(),
                location: "Test Location",
                totalTickets: 100,
                price: 100,
                availableTickets: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Event;

            mockRedisSource.set.mockResolvedValue("OK");
            (mockQueryRunner.manager.findOne as jest.Mock).mockResolvedValue(mockEvent);

            await expect(service.bookEvent(bookEventDto)).resolves.not.toThrow();

            const result = await service.bookEvent(bookEventDto);
            const resultStatus = result.status;
            const resultData = result.data;
            expect(resultStatus).toEqual({
                isBooked: false,
                message: "Event is sold out. Added to waiting list.",
            });
            expect(resultData).toEqual(
                expect.objectContaining({
                    id: 1,
                    availableTickets: 0,
                })
            );
        });
    });

    // Booking Cancellation
    describe("cancelBooking", () => {
        it("should successfully cancel a booking and increase available tickets", async () => {
            const cancelEventDto: CancelBookingRequestDto = {
                bookingId: 1,
            };
    
            const mockEvent: Event = {
                id: 1,
                name: "Test Event",
                description: "Test Description",
                startDate: new Date(),
                endDate: new Date(),
                location: "Test Location",
                totalTickets: 100,
                price: 100,
                availableTickets: 80,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Event;
    
            const mockBooking: Booking = {
                id: 1,
                ticketCount: 10,
                event: mockEvent,
            } as Booking;
    
            mockRedisSource.set.mockResolvedValue("OK");
            (mockQueryRunner.manager.findOne as jest.Mock).mockResolvedValue(mockBooking);
            (mockQueryRunner.manager.remove as jest.Mock).mockResolvedValue(undefined); 
            (mockQueryRunner.manager.save as jest.Mock).mockResolvedValue({
                ...mockEvent,
                availableTickets: mockEvent.availableTickets + 10,
            });
    
            await service.cancelBooking(cancelEventDto);
    
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.manager.findOne).toHaveBeenCalled();
            expect(mockQueryRunner.manager.remove).toHaveBeenCalledWith(mockBooking);
            expect(mockQueryRunner.manager.save).toHaveBeenCalledWith({
                ...mockEvent,
                availableTickets: mockEvent.availableTickets,
            });
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();

        });

        it("should successfully cancel a booking and if there's waiting, book the waiting users", async () => {
            const cancelEventDto: CancelBookingRequestDto = {
                bookingId: 1,
            };

            const mockEvent: Event = {
                id: 1,
                name: "Test Event",
                description: "Test Description",
                startDate: new Date(),
                endDate: new Date(),
                location: "Test Location",
                totalTickets: 100,
                price: 100,
                availableTickets: 80,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Event;

            const mockBooking: Booking = {
                id: 1,
                ticketCount: 10,
                event: mockEvent,
            } as Booking;

            mockRedisSource.set.mockResolvedValue("OK");
            (mockQueryRunner.manager.findOne as jest.Mock).mockResolvedValue(mockBooking);
            (mockQueryRunner.manager.save as jest.Mock).mockResolvedValue({
                ...mockEvent,
                availableTickets: mockEvent.availableTickets + 10,
            });

            await service.cancelBooking(cancelEventDto);
            expect(service.cancelBooking(cancelEventDto)).resolves.not.toThrow();

            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });
    });

    // Event Status
    describe("getStatus", () => {
        it("should return the event status if found", async () => {
            const eventId = 1;
            const mockEvent: Event = {
                id: eventId,
                name: "Test Event",
                description: "Test Description",
                startDate: new Date(),
                endDate: new Date(),
                location: "Test Location",
                totalTickets: 100,
                availableTickets: 100,
                price: 100,
                waitingList: [],
                bookings: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Event;

            mockEventRepository.findOne.mockResolvedValue(mockEvent);
            const eventStatus = await service.getStatus(eventId);

            expect(mockEventRepository.findOne).toHaveBeenCalledWith({
                where: { id: eventId },
                relations: ["bookings", "waitingList"],
            });
            expect(eventStatus).toEqual(mockEvent);
        });

        it("should throw a error if event is not found", async () => {
            const eventId = 1;
            mockEventRepository.findOne.mockResolvedValue(null);

            await expect(service.getStatus(eventId)).rejects.toThrow("Event not found");

            expect(mockEventRepository.findOne).toHaveBeenCalledWith({
                where: { id: eventId },
                relations: ["bookings", "waitingList"],
            });
        });
    });
});
