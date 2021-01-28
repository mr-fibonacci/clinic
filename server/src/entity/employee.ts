import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserAttrs } from './user';

export type EmployeeAttrs = UserAttrs & {
  image: string;
  shiftStart: number;
  shiftEnd: number;
};

export abstract class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  image!: string;

  @Column()
  shiftStart!: number;

  @Column()
  shiftEnd!: number;
}
