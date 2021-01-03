import { DataTypes, Model, Sequelize } from 'sequelize';

interface SecretaryFields {
  UserId: number;
}

interface SecretaryAttrs {
  UserId: number;
}

export class Secretary
  extends Model<SecretaryFields, SecretaryAttrs>
  implements SecretaryFields {
  id!: number;
  UserId!: number;
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
