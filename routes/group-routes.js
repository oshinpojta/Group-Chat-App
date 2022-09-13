const express = require("express");
const GroupController = require("../controllers/group-controller");

const router = express.Router();

router.get("/all", GroupController.getAllGroups);

router.get("/:groupId", GroupController.getGroup);

router.post("/create-group", GroupController.addGroup);

router.delete("/:groupId", GroupController.deleteGroup);

module.exports = router;