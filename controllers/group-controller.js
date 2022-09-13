const GroupServices = require("../services/group-services");
const UserGroupServices = require("../services/user-group-services");
const MessageServices = require("../services/message-services");

exports.getAllGroups = async (req, res, next) => {
    try {
        let groups = await GroupServices.getAllGroups();
        res.json({ success : true, data : groups});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}

exports.getGroup = async (req, res, next) => {
    try {
        let groupId = req.params.groupId;
        let group = await GroupServices.getGroup(groupId);
        res.json({ success : true, data : group});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}

exports.addGroup = async (req, res, next) => {
    try {
        let body = req.body;
        let userId = req.user.id;
        let group = await GroupServices.addGroup(body.name);
        let userGroup = null;
        if(group!=null){
            userGroup = await UserGroupServices.addUserGroup(userId, group.id, true);
        }else{
            res.status(400).json({success : false});
            return;
        }
        let obj = {
            groupDetails : group,
            userGroup : userGroup
        }

        await MessageServices.addMessageInGroup("Created Group!", userId, group.id);
        res.json({success : true, data : obj});

    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}

exports.deleteGroup = async (req, res, next) => {
    try {
        let groupId = req.params.groupId;
        let messages = await MessageServices.getAllMessagesInGroup(groupId);
        for(let i=0;i<messages.length;i++){
            let result = await MessageServices.deleteMessageInGroup(messages[i].id);
            console.log(result);
        }
        let userGroups = await UserGroupServices.getUserGroupByGroupId(groupId);
        for(let i=0;i<userGroups.length;i++){
            let result = await UserGroupServices.removeFromUserGroup(userGroups[i].id);
            console.log(result);
        }
        let result = await GroupServices.deletegroup(groupId);
        res.json({success : true});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}