import {Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Company} from "../company/company.entity";

export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('string')
    city: string;

    @Column('text')
    state: string;

    @Column('string')
    country: string;

    @ManyToOne(() => Company, (company) => company.id)
    companies: Company[]
}