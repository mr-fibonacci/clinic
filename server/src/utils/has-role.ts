import { EntityTarget, getRepository } from 'typeorm';
import { Employee } from '../entity/employee';
import { Patient } from '../entity/patient';

export const hasRole = (
  userId: string,
  roleEntities: EntityTarget<Patient | Employee>[] = []
): Promise<Patient | Employee | undefined>[] => {
  return roleEntities.map((roleEntity) => {
    return getRepository(roleEntity).findOne({
      where: { user: { id: userId } }
    });
  });
};
