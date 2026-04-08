import { DataTypes, Model} from 'sequelize'; 
import type {InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database.js';

class Cat extends Model<InferAttributes<Cat>, InferCreationAttributes<Cat>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare title: string;
  declare descriptionMd: string;
  declare photoUrl: string;
  declare latitude: number;
  declare longitude: number;
  declare createdAt: CreationOptional<Date>;
}

Cat.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descriptionMd: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'description_md',
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'photo_url',
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'cats',
    timestamps: false,
  }
);

export default Cat;