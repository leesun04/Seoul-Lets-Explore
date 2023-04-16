const Sequelize = require('sequelize');
const User = require('./user');
const TravelSpot = require('./travelSpot');
const Review = require('./review');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.TravelSpot = TravelSpot;
db.Review = Review;

Review.init(sequelize);
User.init(sequelize);
TravelSpot.init(sequelize);

User.associate(db);
TravelSpot.associate(db);
Review.associate(db);

module.exports = db;