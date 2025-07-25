import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Requirement } from '../requirement/requirement.entity';
import { Company } from '../company/company.entity';
import { Location } from '../location/location.entity';

export enum Employment_type_enum {
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FULL_TIME = 'full_time',
  'UNKNOWN' = 'unknown'
}

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  position: string;

  @Column('boolean', { default: false })
  remote: boolean;

  @Column('enum', { enum: Employment_type_enum })
  employment_type: Employment_type_enum;

  @Column('int')
  salary_min: number;

  @Column('int')
  salary_max: number;

  @Column('text')
  salary_currency: string;

  @Column('text')
  source: string;

  @Column('text')
  source_id: string;

  @Column('date')
  date_posted: Date;

  @ManyToOne(() => Company, company => company.jobs, { cascade: true })
  company: Company;

  @ManyToOne(() => Location, location => location.jobs, { cascade: true })
  location: Location;

  @ManyToMany(() => Requirement, req => req.jobs)
  @JoinTable()
  requirements: Requirement[];
}
