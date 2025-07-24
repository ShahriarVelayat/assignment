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

    @Column()
    position: string;

    @Column({default: false})
    remote: boolean

    @Column('enum')
    employment_type: Employment_type_enum;

    @Column()
    salary_min: number;

    @Column()
    salary_max: number;

    @Column()
    salary_currency: string;

    @Column({nullable: true})
    salary_raw: string;

    @Column()
    source: string;

    @Column()
    source_id: string;

    @Column()
    external_id: string;

    @Column()
    date_posted: Date;

    @ManyToOne(() => Company, company => company.id, {cascade: true})
    company: Company;

    @ManyToOne(() => Location, location => location.id, {cascade: true})
    location: Location;

    @ManyToMany(() => Requirement, (req) => req.id)
    requirements: Requirement[]
}