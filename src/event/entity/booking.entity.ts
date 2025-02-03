import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "@/event/entity/event.entity";

@Entity("booking")
export class Booking {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    event_id!: number;

    @Column()
    email!: string;

    @Column({name: "ticket_count"})
    ticketCount!: number;

    @Column({name: "total_price", type: "decimal"})
    totalPrice!: number;

    
    @CreateDateColumn({ name: 'created_at'})
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt!: Date;

    @ManyToOne(() => Event, event => event.bookings)
    @JoinColumn({ name: "event_id" })
    event!: Event;
}