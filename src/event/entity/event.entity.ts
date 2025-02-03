import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Booking } from "@/event/entity/booking.entity";
import { WaitingList } from "@/waiting-list/entity/waitingList.entity";

@Entity("event")
export class Event {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({ name: 'start_date'})
    startDate!: Date;

    @Column({ name: 'end_date'})
    endDate!: Date;

    @Column()
    location!: string;

    @Column({ name: 'total_tickets'})
    totalTickets!: number;

    @Column({ name: 'available_tickets'})
    availableTickets!: number;

    @Column("decimal")
    price!: number;

    @CreateDateColumn({ name: 'created_at'})
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt!: Date;

    @OneToMany(() => Booking, booking => booking.event)
    bookings!: Booking[];

    @OneToMany(() => WaitingList, waitingList => waitingList.event)
    waitingList!: WaitingList[];
}