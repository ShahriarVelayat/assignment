import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Location} from "../location/location.entity";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('string')
    name: string;

    @Column('text')
    website: string;

    @Column('string')
    industry: string;

    @OneToMany(() => Location, (location) => location.id)
    locations: Location[]
}