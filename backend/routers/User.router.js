const express=require("express");
const { RegisterUser, Login } = require("../controllers/User.controller");
const UserRouter=express.Router();

UserRouter.route("/register").post(RegisterUser);
UserRouter.route("/login").post(Login);


module.exports={
    UserRouter
}