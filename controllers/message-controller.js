const MessageServices = require("../services/message-services");
const UserServices = require("../services/user-services");
const S3Services = require("../services/s3-services");
const fs = require("fs");
const path = require("path");

const userServices = new UserServices();
exports.getAllMessagesInGroup = async (req, res, next) => {
    try {
        let lastMessageId = req.query.lastMessageId;
        let groupId = req.params.groupId;
        let messages = [];
        if(lastMessageId){
            messages = await MessageServices.getAllMessagesInGroupByQuery(groupId, lastMessageId);
        }else{
            messages = await MessageServices.getAllMessagesInGroup(groupId);
        } 
        let data = [];
        for(let i=0;i<messages.length;i++){
            let userId = messages[i].userId;
            let user = await userServices.getUser(userId);
            let userObj = {
                id : user.id,
                name : user.name,
                email : user.email,
                phone : user.phone
            }
            data.push({
                message : messages[i],
                user : userObj
            });
        }
        res.json({success : true, data : data});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}

exports.uploadImage = async (req, res, next) => {
    try {
        let groupId = req.query.groupId;
        let userId = req.user.id;
        console.log(req.files.image);
        let filename = req.files.image.name;
        const filenameDir = `Messages${req.user.id}/${filename}`;
        const data = new Buffer.from(req.files.image.data, 'base64');
        let s3response = await S3Services.uploadFile( data, filenameDir);
        //console.log(s3response);
        let response = await MessageServices.addMessageInGroup(`img-link:${s3response.Location}`, userId, groupId);
        res.json({ data : response, success : true});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success : false});
    }
}

exports.addMessageInGroup = async (req, res, next) => {
    try {
        let body = req.body;
        let userId = req.user.id;
        let result = await MessageServices.addMessageInGroup(body.message, userId, body.groupId);
        res.json({success : true, data : result});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}

exports.deletMessageInGroup = async (req, res, next) => {
    try {
        let messageId = req.params.messageId;
        let result = await MessageServices.deleteMessageInGroup(messageId);
        res.json({ success : true, data : result});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}