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

User.fromTelegramRequest = async (body) => {
  const telegramId = body.message.from.id.toString()
  const conversationId = body.message.chat.id
  return User.findOrCreate({
    where: { telegramId },
    defaults: { 
      conversationId,
      currentQuestion: null
    }
  })
}

module.export = User;