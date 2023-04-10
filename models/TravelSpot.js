const Sequelize = require('sequelize');

module.exports = class Tourist extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            touristId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true
            },//관광지 id
            name: {
                 type: Sequelize.STRING,
                 allowNull: false
            },//관광지 이름
            postal: {
                type: Sequelize.INTEGER,
                allowNull: true
            },//우편번호
            address: {
                type: Sequelize.TEXT,
                allowNull: false
            },//주소
            latitude: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },//위도
            longitude: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },//경도
            outline: {
                type: Sequelize.TEXT,
                allowNull: false
            },//개요
            phone: {
                type: Sequelize.TEXT,
                allowNull: true
            },//전화번호
            rest: {
                type: Sequelize.TEXT,
                allowNull: true
            },//쉬는날
            time: {
                type: Sequelize.TEXT,
                allowNull: true
            },//이용시간
            info: {
                type: Sequelize.TEXT,
                allowNull: true
            }//상세정보
        }, {
            sequelize,
            timestamps: false,
            // underscored: false,
            modelName: 'Tourist',
            tableName: 'tourists',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    // static associate(db) {
    //     db.Tourist.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId'});
    // }
};
