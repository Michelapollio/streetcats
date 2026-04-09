import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
class Cat extends Model {
}
Cat.init({
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
}, {
    sequelize,
    tableName: 'cats',
    timestamps: false,
});
export default Cat;
