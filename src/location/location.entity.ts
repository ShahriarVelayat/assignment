import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../company/company.entity';
import { Job } from '../job/job.entity';

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

  @OneToMany(() => Job, job => job.location)
  jobs: Job[];

  @ManyToOne(() => Company, company => company.locations)
  companies: Company;
}
