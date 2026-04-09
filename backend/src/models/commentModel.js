import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
class Comment extends Model {
}
Comment.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    catId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'cat_id',
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
    },
}, {
    sequelize,
    tableName: 'comments',
    timestamps: false,
});
export default Comment;
