const Sequelize = require('sequelize');

module.exports = class place extends Sequelize.Model {
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
                 allowNull: false
            },
            url: {//URL
                type: Sequelize.INTEGER,
                allowNull: true
            },
            address: {//주소
                type: Sequelize.TEXT,
                allowNull: true
            },
            newAddress: {//신주소
                type: Sequelize.TEXT,
                allowNull: true
            },
            phone: {//폰번호
                type: Sequelize.BIGINT,
                allowNull: false
            },
            site: {//웹사이트
                type: Sequelize.TEXT,
                allowNull: false
            },
            time: {//운영시간
                type: Sequelize.TEXT,
                allowNull: false
            },
            day: {//운영요일
                type: Sequelize.TEXT,
                allowNull: true
            },
            rest: {//휴무일
                type: Sequelize.TEXT,
                allowNull: true
            },
            traffic: {//교통 정보
                type: Sequelize.TEXT,
                allowNull: true
            },
            tage: {//태그 정보
                type: Sequelize.TEXT,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            // underscored: false,
            modelName: 'Place',
            tableName: 'place',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    };

};