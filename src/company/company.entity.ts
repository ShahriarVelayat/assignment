import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from '../location/location.entity';
import { Job } from '../job/job.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  website: string;

  @Column('text', { nullable: true })
  industry: string;

  @OneToMany(() => Job, job => job.company)
  jobs: Job[];

  @OneToMany(() => Location, location => location.companies)
  locations: Location[];
}
