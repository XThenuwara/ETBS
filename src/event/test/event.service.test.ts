import { Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { SqlLiteDataSource } from "@/config/database.config"; 
import { CreateEventDto } from "../dto/create-event.dto";
import { EventService } from "../event.service";

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
            create: jest.fn(),
            save: jest.fn(),
        } as unknown as jest.Mocked<Repository<Event>>;

        jest.spyOn(SqlLiteDataSource, "getRepository").mockReturnValue(mockEventRepository);
        service = new EventService();
    });

    it("should initialize and save the event successfully", async () => {
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
