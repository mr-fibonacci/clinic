// import { EntityTarget } from 'typeorm';
// import { Employee } from '../entity/employee';
// import { Patient } from '../entity/patient';
// import { User } from '../entity/user';
// import { hasRole } from './has-role';
// import { isAdmin } from './is-admin';

// should I hardcode admin or secretary here
// or just use composition in ownsResource?

// export const isAdminOr = (
//   userId: string,
//   roleEntities: EntityTarget<Patient | Employee>[] = []
// ): Promise<User | Patient | Employee | undefined>[] => [
//   isAdmin(userId),
//   ...hasRole(userId, roleEntities)
// ];
