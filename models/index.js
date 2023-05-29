const Sequelize = require('sequelize');
const User = require('./user');
const TravelSpot = require('./TravelSpot');
const Cart = require('./cart')

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
db.Cart = Cart;

User.init(sequelize);
TravelSpot.init(sequelize);
Cart.init(sequelize);

// User.associate(db);
// TravelSpot.associate(db);
// Review.associate(db);

module.exports = db;