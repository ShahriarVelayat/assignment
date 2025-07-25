import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  //
  // @OneToMany(() => Location, location => location.id)
  // locations: Location[];
}
