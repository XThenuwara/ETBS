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
    start_date!: Date;

    @Column()
    end_date!: Date;

    @Column()
    location!: string;

    @Column()
    total_tickets!: number;

    @Column()
    available_tickets!: number;

    @Column("decimal")
    price!: number;

    @CreateDateColumn()
    created_a!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => Booking, booking => booking.event)
    bookings!: Booking[];

    @OneToMany(() => WaitingList, waitingList => waitingList.event)
    waitingList!: WaitingList[];
}