import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Location} from "../location/location.entity";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text')
    website: string;

    @Column('text')
    industry: string;

    @OneToMany(() => Location, (location) => location.id)
    locations: Location[]
}