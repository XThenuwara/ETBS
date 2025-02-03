import { Event } from "@/event/entities/event.entity";

export class BookEventRequestDto {
  eventId!: number;
  email!: string;
}

export class BookEventResponseDto {
  status!: {
    isBooked: boolean;
    message: string;
  };
  data!: Event;
}