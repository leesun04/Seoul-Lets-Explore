const Sequelize = require('sequelize');
const User = require('./user');
const TravelSpot = require('./TravelSpot');
const Cart = require('./cart')
const CartTravelSpot = require('./CartTravelSpot');
const Place = require('./place');

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
db.CartTravelSpot = CartTravelSpot;
db.Place = Place;

User.init(sequelize);
TravelSpot.init(sequelize);
Cart.init(sequelize);
CartTravelSpot.init(sequelize);
Place.init(sequelize);

User.associate(db);
TravelSpot.associate(db);
Cart.associate(db);
CartTravelSpot.associate(db);

module.exports = db;