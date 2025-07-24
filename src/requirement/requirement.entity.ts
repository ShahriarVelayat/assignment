import {Column, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Job} from "../job/job.entity";

export class Requirement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('string')
    name: string;

    @Column('number')
    experience_level: number;

    @ManyToMany(() => Job, (job) => job.id)
    jobs: Job[]
}