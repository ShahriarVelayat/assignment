import {Column, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Requirement} from "../requirement/requirement.entity";
import {Company} from "../company/company.entity";
import {Location} from "../location/location.entity";

export enum Employment_type_enum {
    PART_TIME = "part_time",
    CONTRACT = "contract",
    FULL_TIME = "full_time",

}

export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('string')
    position: string;

    @Column('boolean', {default: false})
    remote: boolean

    @Column('enum')
    employment_type: Employment_type_enum;

    @Column('number')
    salary_min: number;

    @Column('number')
    salary_max: number;

    @Column('string')
    salary_currency: string;

    @Column('string', {nullable: true})
    salary_raw: string;

    @Column('string')
    source: string;

    @Column('string')
    source_id: string;

    @Column('string')
    external_id: string;

    @Column('date')
    date_posted: Date;

    @ManyToOne(() => Company, company => company.id, {cascade: true})
    company: Company;

    @ManyToOne(() => Location, location => location.id, {cascade: true})
    location: Location;

    @ManyToMany(() => Requirement, (req) => req.id)
    requirements: Requirement[]
}