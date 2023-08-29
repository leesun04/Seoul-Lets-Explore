const Sequelize = require('sequelize');

module.exports = class TravelSpot extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            tourId: {//관광지 id
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {//관광지 이름
                 type: Sequelize.STRING,
                 allowNull: true
            },
            postal: {//우편번호
                type: Sequelize.INTEGER,
                allowNull: true
            },
            address: {//주소
                type: Sequelize.TEXT,
                allowNull: true
            },
            latitude: {//위도
                type: Sequelize.DOUBLE,
                allowNull: true
            },
            longitude: {//경도
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            outline: {//개요
                type: Sequelize.TEXT,
                allowNull: false
            },
            phone: {//전화번호
                type: Sequelize.TEXT,
                allowNull: false
            },
            rest: {//쉬는날
                type: Sequelize.TEXT,
                allowNull: false
            },
            time: {//이용시간
                type: Sequelize.TEXT,
                allowNull: true
            },
            info: {//상세정보
                type: Sequelize.TEXT,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            // underscored: false,
            modelName: 'TravelSpot',
            tableName: 'travelSpots',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    };
    static associate(db) {
        db.TravelSpot.belongsToMany(db.Cart, { through: 'CartTravelSpot', foreignKey: 'tourId' });
        }
};