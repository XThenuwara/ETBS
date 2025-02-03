import { Router, Request, Response } from "express";
import { EventService } from "./event.service";
import { sendResponse } from "../lib/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { BookEventRequestDto } from "./dto/book-event.dto";
import { ResponseType } from "../lib/types/response.type";

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

eventRouter.post("/events", initializeEvent);
eventRouter.post("/events/book", bookEvent);

export default eventRouter;
