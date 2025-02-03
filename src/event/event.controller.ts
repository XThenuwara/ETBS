import { Request, Response } from "express";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { ResponseType } from "../lib/types/response.type";
import { sendResponse } from "../lib/common";

export class EventController {
  private static eventService: EventService = new EventService();

  static async initialize(req: Request, res: Response) {
    try {
      console.log("Initializing events...");
      const body: CreateEventDto = req.body;
      console.log("🚀 ~ EventController ~ initialize ~ body:", body)
      const result = await EventController.eventService.initialize(body);
      sendResponse(res, 200, "OK", result);
    } catch (error) {
      console.error("Errror EventController.initialize: ", error);
      sendResponse(res, 500, "Internal Server Error", null, error);
    }
  }
}
