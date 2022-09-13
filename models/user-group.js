const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const UserGroup = sequelize.define("user-group",{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    isAdmin : {
        type : Sequelize.BOOLEAN,
        allowNull : false, 
        default : false
    }
});


module.exports = UserGroup;