const Sequelize = require('sequelize');

module.exports = class Cart extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            cartId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            userId:{
                type: Sequelize.BIGINT,
                allowNull: false
            },
            tourId: {
                type: Sequelize.BIGINT,
                allowNull: false
            }
        },
        {
            sequelize,
            timestamps: false,
            modelName: 'Cart',
            tableName: 'cart',
            charset: "utf8mb4",
            collate: 'utf8mb4_general_ci'
        });
    };
    static associations(db) {
        db.Cart.belongsTo(db.User,{foreignKey: 'userId', targetKey: 'userId'});
    }
}