import { DataTypes, Model, Sequelize } from 'sequelize';
import { Medic, MedicAttrs } from './medic';
import { User, UserAttrs } from './user';

interface SecretaryFields {
  UserId: number;
}

interface SecretaryAttrs {
  UserId: number;
}

interface AddMedicAttrs extends UserAttrs, MedicAttrs {}

export class Secretary
  extends Model<SecretaryFields, SecretaryAttrs>
  implements SecretaryFields {
  id!: number;
  UserId!: number;

  static addMedic = async (AddMedicAttrs: AddMedicAttrs): Promise<void> => {
    // create user
    const { email, password } = AddMedicAttrs;
    const user = await User.signup(email, password);

    // upload image
    const { image } = AddMedicAttrs;
    // get img url

    // create medic
    const { type, startingHour, shiftLength } = AddMedicAttrs;
    Medic.create({
      UserId: user.id,
      type,
      startingHour,
      shiftLength,
      image
    });
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const secretary = (sequelize: Sequelize) => {
  Secretary.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      }
    },
    { sequelize }
  );

  return Secretary;
};
