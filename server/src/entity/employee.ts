import { Column, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from '../custom-types-consts';
import { User, UserAttrs } from './user';

export type EmployeeAttrs = UserAttrs & {
  image: string;
  shiftStart: number;
  shiftEnd: number;
};

export abstract class Employee implements Resource {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  image!: string;

  @Column()
  shiftStart!: number;

  @Column()
  shiftEnd!: number;

  @JoinColumn()
  user!: User;

  isOwnedByUser = (userId: string): boolean => {
    return this.user.id === userId;
  };
}
