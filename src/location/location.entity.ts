import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Company} from "../company/company.entity";


@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    city: string;

    @Column('text')
    state: string;

    @Column('text')
    country: string;

    @ManyToOne(() => Company, (company) => company.id)
    companies: Company[]
}