import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity("booking")
export class Booking {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    event_id!: number;

    @Column()
    email!: string;

    @Column()
    ticket_count!: number;

    @Column("decimal")
    total_price!: number;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @ManyToOne(() => Event, event => event.bookings)
    @JoinColumn({ name: "event_id" })
    event!: Event;
}