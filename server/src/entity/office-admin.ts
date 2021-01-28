import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Employee, EmployeeAttrs } from './employee';
import { User } from './user';

export enum OfficeAdminType {
  manager = 'manager',
  assistant = 'assistant'
}

type OfficeAdminAttrs = EmployeeAttrs & {
  type: OfficeAdminType;
};

@Entity()
export class OfficeAdmin extends Employee {
  @Column()
  type!: OfficeAdminType;

  @OneToOne(() => User, (user) => user.officeAdmin)
  @JoinColumn()
  user!: User;
}
