import { IsString, IsNumber, IsDate, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateEventDto {
    @IsString()
    name!: string;

    @IsString()
    description!: string;

    @Type(() => Date)
    @IsDate()
    startDate!: Date;

    @Type(() => Date)
    @IsDate()
    endDate!: Date;

    @IsString()
    location!: string;

    @IsNumber()
    @Min(0)
    totalTickets!: number;

    @IsNumber()
    @Min(0)
    availableTickets!: number;

    @IsNumber()
    @Min(0)
    price!: number;
}
