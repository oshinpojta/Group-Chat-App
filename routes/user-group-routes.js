const express = require("express");
const UserGroupController = require("../controllers/user-group-controller");

const router = express.Router();

router.get("/all", UserGroupController.getAllUserGroupsByUser);

router.get("/all/:groupId", UserGroupController.getAllUserGroupsByGroupId);

router.post("/addUserGroup", UserGroupController.addUserGroup);

router.post("/setAdmin", UserGroupController.setAdmin);

router.delete("/delete/:userGroupId", UserGroupController.removeUserFromGroup);

router.delete("/deleteByGroupId/:groupId", UserGroupController.removeUserFromGroupByGroupId);

module.exports = router;