const Sequelize = require('sequelize');

module.exports = class Review extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            reviewId: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            review: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Review',
            tableName: 'reviews',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Review.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' });
        db.Review.belongsTo(db.TravelSopt, { foreignKey: 'tourId', targetKey: 'tourId' });
    }
};
