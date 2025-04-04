const express = require('express');
const route = express.Router();
const feedController = require("../controllers/controller");



route.get("/feed", feedController.renderHomePage);
route.post("/feed", feedController.addPost);
route.get("/feed/:feedId", feedController.renderDetailsPost);
route.get("/feed/edit/:feedId", feedController.editPostPage);
route.post("/feed/:feedId", feedController.editPostForm);
route.get("/feed/delete/:feedId", feedController.deletePost);




 route.get('/', feedController.notFoundPage);
module.exports = route;
