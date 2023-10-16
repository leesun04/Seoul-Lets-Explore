const Sequelize = require('sequelize');

module.exports = class Plan extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                planId: {
                    type: Sequelize.BIGINT,
                    primaryKey: true,
                    autoIncrement: true
                },
                start: {
                    type: Sequelize.DATE, 
                    allowNull: false
                },
                end: {
                    type: Sequelize.DATE, 
                    allowNull: false
                },
                planName:{
                    type: Sequelize.TEXT,
                    allowNull: false
                },
                planContent: {
                    type: Sequelize.TEXT,
                    allowNull: true
                }
            },
            {
                sequelize,
                timestamps: false,
                modelName: 'Plan',
                tableName: 'plan',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'
            }
        );
    }

    static associate(db) {
        db.Plan.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' });
    }
};
