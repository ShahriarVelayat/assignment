import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Job} from "../job/job.entity";

@Entity()

export class Requirement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('int')
    experience_level: number;

    @ManyToMany(() => Job, (job) => job.id)
    jobs: Job[]
}