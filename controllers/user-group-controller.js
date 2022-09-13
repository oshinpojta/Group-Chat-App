const UserGroupServices = require("../services/user-group-services");
const GroupServices = require("../services/group-services");
const MessageServices = require("../services/message-services");
const UserServices = require("../services/user-services");

let userServices = new UserServices();

exports.getAllUserGroupsByUser = async (req, res, next) => {
    try {
        let userId = req.user.id;
        let data = [];
        let userGroups = await UserGroupServices.getAllUserGroupsByUser(userId);
        for(let i=0;i<userGroups.length;i++){
            let group = await GroupServices.getGroup(userGroups[i].groupId);
            let obj = {
                userGroup : userGroups[i],
                groupDetails : group
            }
            data.push(obj);
        }
        let user = {
            id : userId,
            name : req.user.name,
            email : req.user.email,
            phone : req.user.phone
        }
        res.json({success : true, data : data, user : user});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}

exports.getAllUserGroupsByGroupId = async (req, res, next) => {
    try {
        let groupId = req.params.groupId;
        let result = [];
        let userGroups = await UserGroupServices.getUserGroupByGroupId(groupId);
        for(let i=0;i<userGroups.length;i++){
            let userDetails = await userServices.getUser(userGroups[i].userId);
            result.push({
                userGroup : userGroups[i],
                userDetails : userDetails
            })
        }
        res.json({ success : true, data : result});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}

exports.addUserGroup = async (req, res, next) => {
    try {
        let body = req.body;
        let result = await UserGroupServices.addUserGroup(body.userId, body.groupId, false);
        await MessageServices.addMessageInGroup("Joined!", body.userId, body.groupId);
        res.json({success : true, data : result});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}

exports.setAdmin = async (req, res, next) => {
    try {
        let userGroupId = req.body.userGroupId;
        let isAdmin = req.body.isAdmin;
        let result = await UserGroupServices.setAdmin(userGroupId, !isAdmin);
        if(result){
            res.json({ success : true, data : result});
        }else{
            res.status(400).json({ success : false});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}

exports.removeUserFromGroup = async (req, res, next) => {
    try {
        let userGroupId = req.params.userGroupId;
        let userGroup = await UserGroupServices.getUserGroupById(userGroupId);
        await MessageServices.addMessageInGroup("Removed!", userGroup.userId, userGroup.groupId);
        let result = await UserGroupServices.removeFromUserGroup(userGroupId);
        res.json({success : true});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}

exports.removeUserFromGroupByGroupId = async (req, res, next) => {
    try {
        let groupId = req.params.groupId;
        let userId = req.user.id;
        let userGroup = await UserGroupServices.getUserGroupByGroupIdAndUserId(userId, groupId);
        await MessageServices.addMessageInGroup("Removed!", userId, groupId);
        let result = await UserGroupServices.removeFromUserGroup(userGroup.id);
        res.json({success : true});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false});
    }
}
