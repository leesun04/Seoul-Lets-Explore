const { STRING } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            userId: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            id : {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    // static associate(db) {
    //     db.User.hasMany(db.Review, { foreignKey: 'userId', sourceKey: 'userId', onDelete: 'cascade' });
    //     // db.User.hasMany(db.Tourist, {foreignKey: 'userId', sourceKey: 'userId', onDelete: 'cascade'});
    //     db.User.hasMany(db.Waiting, { foreignKey: 'userId', sourceKey: 'userId', onDelete: 'cascade' });
    // }
};
