const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

class User extends Model {}
User.init({
  telegramId: DataTypes.STRING,
  conversationId: DataTypes.STRING,
  name: DataTypes.STRING,
  latLon: DataTypes.STRING,
  currentQuestion: DataTypes.STRING
}, { sequelize, modelName: 'user' });

module.export = User;