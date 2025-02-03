import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Booking } from "./booking.entity";
import { WaitingList } from "./waitingList.entity";

@Entity("event")
export class Event {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column()
    startDate!: Date;

    @Column()
    endDate!: Date;

    @Column()
    location!: string;

    @Column()
    totalTickets!: number;

    @Column()
    availableTickets!: number;

    @Column("decimal")
    price!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Booking, booking => booking.event)
    bookings!: Booking[];

    @OneToMany(() => WaitingList, waitingList => waitingList.event)
    waitingList!: WaitingList[];
}