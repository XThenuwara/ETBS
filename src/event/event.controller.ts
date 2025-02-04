import { Router, Request, Response } from "express";
import { EventService } from "@/event/event.service";
import { sendResponse } from "@/lib/common";
import { CreateEventDto } from "@/event/dto/create-event.dto";
import { BookEventRequestDto } from "@/event/dto/book-event.dto";
import { ResponseType } from "@/lib/types/response.type";
import { CancelBookingRequestDto } from "@/event/dto/cancel-event.dto";

const eventService = new EventService();
const eventRouter = Router();

const initializeEvent = async (req: Request, res: Response<ResponseType>) => {
    try {
        console.log("Creating new event", req.body);
        const body: CreateEventDto = req.body;
        const result = await eventService.initialize(body);
        sendResponse(res, 200, "OK", result);
    } catch (error) {
        console.error("Error in initializeEvent:", error);
        sendResponse(res, 500, "Internal Server Error", null, error);
    }
};

const bookEvent = async (req: Request, res: Response<ResponseType>) => {
    try {
        console.log("Booking event", req.body);
        const request: BookEventRequestDto = req.body;
        const response = await eventService.bookEvent(request);
        sendResponse(res, 200, "OK", response);
    } catch (error) {
        console.error("Error in bookEvent:", error);
        sendResponse(res, 500, "Internal Server Error", null, error);
    }
};

const cancelBooking = async (req: Request, res: Response<ResponseType>) => {
    try {
        console.log("Canceling booking", req.body);
        const cancelBookingRequest: CancelBookingRequestDto = req.body;
        await eventService.cancelBooking(cancelBookingRequest);
        sendResponse(res, 200, "OK", null);
    } catch (error) {
        console.error("Error in cancelBooking:", error);
        sendResponse(res, 500, "Internal Server Error", null, error);
    }
};

const getEventStatus = async (req: Request, res: Response<ResponseType>) => {
    try {
        const eventId = parseInt(req.params.id, 10);
        const status = await eventService.getStatus(eventId);
        sendResponse(res, 200, "OK", status);
    } catch (error) {
        console.error("Error in getEventStatus:", error);
        sendResponse(res, 500, "Internal Server Error", null, error);
    }
};

eventRouter.post("/events", initializeEvent);
eventRouter.post("/events/booking", bookEvent);
eventRouter.post("/events/cancel", cancelBooking);
eventRouter.get('/events/:id', getEventStatus)

export default eventRouter;
