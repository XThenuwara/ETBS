export class CreateEventDto {
  name!: string;

  description!: string;

  startDate!: Date;

  endDate!: Date;

  location!: string;

  totalTickets!: number;

  availableTickets!: number;

  price!: number;
}
