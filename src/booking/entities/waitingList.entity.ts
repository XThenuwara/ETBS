import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity("waiting_list")
export class WaitingList {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    event_id!: number;

    @Column()
    email!: string;

    @Column()
    ticket_count!: number;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @ManyToOne(() => Event, event => event.waitingList)
    @JoinColumn({ name: "event_id" })
    event!: Event;
}