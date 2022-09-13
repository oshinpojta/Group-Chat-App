const Sequelize = require("sequelize");
const Message = require("../models/message");

const Op = Sequelize.Op;

exports.getAllMessagesInGroup = async (groupId) => {
    try {
        return await Message.findAll({ where : {groupId : groupId}});
    } catch (error) {
        throw error;
    }
}

exports.getAllMessagesInGroupByQuery = async (groupId, lastMessageId) => {
    try {
        return await Message.findAll({ where : { id : {[Op.gt] : lastMessageId} ,groupId : groupId, }})
    } catch (error) {
        throw error
    }
}

exports.addMessageInGroup = async (message, userId, groupId) => {
    try {
        return await Message.create({ message : message, userId : userId, groupId : groupId});
    } catch (error) {
        throw error;
    }
}

exports.deleteMessageInGroup = async (messageId) => {
    try {
        return await Message.destroy({where : {id : messageId}});
    } catch (error) {
        throw error;
    }
}

