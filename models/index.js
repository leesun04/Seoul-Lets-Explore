const Sequelize = require('sequelize');
const User = require('./user');
const Cart = require('./cart')
const CartTravelSpot = require('./CartTravelSpot');
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
db.Cart = Cart;
db.CartTravelSpot = CartTravelSpot;
db.Place = Place;
db.Plan = Plan;

User.init(sequelize);
Cart.init(sequelize);
CartTravelSpot.init(sequelize);
Place.init(sequelize);
Plan.init(sequelize);

User.associate(db);
Cart.associate(db);

module.exports = db;