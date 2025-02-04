import { Event } from "@/event/entity/event.entity";
import { IsNotEmpty, IsNumber, IsEmail } from "class-validator";
export class BookEventRequestDto {
  @IsNotEmpty()
  @IsNumber()
  eventId!: number;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsNumber()
  ticketCount!: number;
}

export class BookEventResponseDto {
  status!: {
    isBooked: boolean;
    message: string;
  };
  data!: Event;
}