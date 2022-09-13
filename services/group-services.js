const Group = require("../models/group");


exports.getAllGroups = async () => {
    try {
        return await Group.findAll();
    } catch (error) {
        throw error;
    }
}

exports.getGroup = async (groupId) => {
    try {
        return await Group.findByPk(groupId);
    } catch (error) {
        throw error;
    }
}

exports.addGroup = async (groupname) => {
    try {
        return await Group.create({name : groupname});
    } catch (error) {
        throw error;
    }
}

exports.deletegroup = async (groupId) => {
    try {
        return await Group.destroy({ where : { id : groupId}});
    } catch (error) {
        throw error;
    }
}

