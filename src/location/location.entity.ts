import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  // @ManyToOne(() => Company, (company) => company.id)
  // companies: Company[]
}
