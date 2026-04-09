import User from './userModel.js';
import Cat from './catModel.js';
import Comment from './commentModel.js';
// Relazioni User <-> Cat
User.hasMany(Cat, { foreignKey: 'userId', as: 'cats' });
Cat.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
// Relazioni User <-> Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
// Relazioni Cat <-> Comment
Cat.hasMany(Comment, { foreignKey: 'catId', as: 'comments' });
Comment.belongsTo(Cat, { foreignKey: 'catId', as: 'cat', onDelete: 'CASCADE' });
export { User, Cat, Comment };
