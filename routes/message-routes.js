const express = require("express");

const MessageController = require("../controllers/message-controller");
const router = express.Router();

router.get("/group/:groupId", MessageController.getAllMessagesInGroup);

router.post("/addMessage", MessageController.addMessageInGroup);

router.post("/upload-image", MessageController.uploadImage);

router.delete("/:messageId", MessageController.deletMessageInGroup);

module.exports = router;