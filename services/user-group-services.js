const UserGroup = require("../models/user-group");

exports.getUserGroupById = async (userGroupId) => {
    try {
        return await UserGroup.findByPk(userGroupId);
    } catch (error) {
        throw error;
    }
}

exports.getAllUserGroupsByUser = async (userId) => {
    try {
        return await UserGroup.findAll({ where : { userId : userId}});
    } catch (error) {
        throw error;
    }
}

exports.getUserGroupByGroupId = async (groupId) => {
    try {
        return await UserGroup.findAll({ where : {groupId : groupId}});
    } catch (error) {
        throw error;
    }
}

exports.getUserGroupByGroupIdAndUserId = async (userId, groupId) => {
    try {
        return await UserGroup.findOne({ where : { userId : userId, groupId : groupId}});
    } catch (error) {
        throw error;
    }
}

exports.addUserGroup = async (userId, groupId, isAdmin) => {
    try {
        return await UserGroup.create({userId : userId, groupId : groupId, isAdmin : isAdmin });
    } catch (error) {
        throw error;
    }
}

exports.setAdmin = async (userGroupId, isAdmin) => {
    try {
        let userGroup = await UserGroup.findByPk(userGroupId);
        if(userGroup){
            return userGroup.update({
                isAdmin : isAdmin
            });
        }
    } catch (error) {
        throw error;
    }
}

exports.removeFromUserGroup = async (userGroupId) => {
    try {
        return await UserGroup.destroy({ where : {id : userGroupId}});
    } catch (error) {
        throw error;
    }
}
