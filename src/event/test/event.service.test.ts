import { EventService } from '../event.service';

describe('EventService', () => {
    let service: EventService;

    beforeEach(() => {
        service = new EventService();
    });

    describe('initialize', () => {
        it('should return an object with id', async () => {
            const result = await service.initialize();
            expect(result).toEqual({
                id: expect.any(Number),
            });
        });

        it('should be called successfully', async () => {
            const initializeSpy = jest.spyOn(service, 'initialize');
            await service.initialize();
            expect(initializeSpy).toHaveBeenCalled();
        });

        it('should resolve the promise', async () => {
            await expect(service.initialize()).resolves.toBeDefined();
        });

        it('should not throw any errors', async () => {
            await expect(service.initialize()).resolves.not.toThrow();
        });
    });
});