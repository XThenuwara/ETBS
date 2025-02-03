import { Repository } from "typeorm";
import { Event } from "@/event/entity/event.entity";
import { SqlLiteDataSource } from "@/config/database.config";
import { CreateEventDto } from "@/event/dto/create-event.dto";
import { EventService } from "@/event/event.service";
import { BookEventRequestDto } from "@/event/dto/book-event.dto";

describe("EventService", () => {
    let service: EventService;
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
            create: jest.fn(),
            save: jest.fn(),
        } as unknown as jest.Mocked<Repository<Event>>;

        jest.spyOn(SqlLiteDataSource, "getRepository").mockReturnValue(mockEventRepository);
        service = new EventService();
    });

    // Event Initialization
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

            mockEventRepository.findOne.mockResolvedValue(mockEvent);
            mockEventRepository.save.mockResolvedValue(mockEvent);

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

            mockEventRepository.findOne.mockResolvedValue(mockEvent);
            mockEventRepository.save.mockResolvedValue({
                ...mockEvent,
                waitingList: [],
            });

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
});
