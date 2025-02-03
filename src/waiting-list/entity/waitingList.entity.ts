import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "@/event/entity/event.entity";

@Entity("waiting_list")
export class WaitingList {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name: "event_id"})
    eventId!: number;

    @Column()
    email!: string;

    @Column({ name: 'ticket_count'})
    ticketCount!: number;

    @CreateDateColumn({ name: 'created_at'})
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt!: Date;

    @ManyToOne(() => Event, event => event.waitingList)
    @JoinColumn({ name: "event_id" })
    event!: Event;
}