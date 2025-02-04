import { IsNotEmpty, IsNumber } from "class-validator";

export class CancelBookingRequestDto {
    @IsNumber()
    @IsNotEmpty()
    bookingId!: number;
}
