const Sequelize = require('sequelize');

module.exports = class Cart extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            cartId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            }           
        })
    }
}