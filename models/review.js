const Sequelize = require('sequelize');


module.exports = class Review extends Sequelize.Module {
    static init(sequelize){
        return super.init({
            reviewId:{
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true   
            },
            name: {
              type: Sequelize.STRING,
              allowNull: false  
            }
        })
    }
}