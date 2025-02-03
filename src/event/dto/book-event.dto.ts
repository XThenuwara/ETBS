import { Event } from "@/event/entity/event.entity";

export class BookEventRequestDto {
  eventId!: number;
  email!: string;
  ticketCount!: number;
}

export class BookEventResponseDto {
  status!: {
    isBooked: boolean;
    message: string;
  };
  data!: Event;
}