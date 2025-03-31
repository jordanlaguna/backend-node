const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// get all users
router.get("/", userController.getAllUsers);

// create a new user
router.post("/register", userController.createUser);

// update user by id
router.put("/:id", userController.updateUser);

// delete user by id
router.delete("/:id", userController.deleteUser);

// login user
router.post("/login", userController.validationLogin);

module.exports = router;
