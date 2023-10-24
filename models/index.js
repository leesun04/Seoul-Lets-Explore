const Sequelize = require('sequelize');
const User = require('./user');
const Place = require('./place');
const Plan = require('./plan');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Place = Place;
db.Plan = Plan;

User.init(sequelize);
Place.init(sequelize);
Plan.init(sequelize);

User.associate(db);

module.exports = db;