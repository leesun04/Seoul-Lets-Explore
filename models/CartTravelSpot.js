const Sequelize = require('sequelize');

module.exports = class CartTravelSpot extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                cartId: {
                    type: Sequelize.BIGINT, 
                    allowNull: false,
                    references: {
                        model: 'Cart',
                        key: 'id'
                    }
                },
                tourId: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    references: {
                        model: 'TravelSpot',
                        key: 'tourId'
                    }
                }
            },
            {
                sequelize,
                timestamps: false,
                modelName: 'CartTravelSpot',
                tableName: 'cart_travel_spot',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'
            }
        );
    }

    static associate(db) {
        // CartTravelSpot 모델과 Cart 모델의 관계 설정
        db.CartTravelSpot.belongsTo(db.Cart, {
            foreignKey: 'id',
            targetKey: 'id'
        });

        // CartTravelSpot 모델과 TravelSpot 모델의 관계 설정
        db.CartTravelSpot.belongsTo(db.TravelSpot, {
            foreignKey: 'tourId',
            targetKey: 'tourId'
        });
    }
};
