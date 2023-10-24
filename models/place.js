const Sequelize = require('sequelize');

module.exports = class Place extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            tourId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                 type: Sequelize.STRING,
                 allowNull: false
            },
            url: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            phone: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            time: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            day: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            rest: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            traffic: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            tage: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            latitude: {
                type: Sequelize.DOUBLE, // 수정: 데이터 형식 변경
                allowNull: false
            },
            longitude: {
                type: Sequelize.DOUBLE, // 수정: 데이터 형식 변경
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Place',
            tableName: 'place',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    };
};
