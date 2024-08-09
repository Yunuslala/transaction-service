const bcrypt = require("bcrypt");
const { User,sequelize } = require("../models/model");
const jwt = require("jsonwebtoken");
require('dotenv').config();
exports.RegisterUser = async (req, res) => {
  try {
    
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .send({ success: false, msg: "Provide all the fields" });
    }
    const findExisting = await User.findOne({ where: { email } });
    if (findExisting) {
      return res
        .status(400)
        .send({ success: false, msg: "User already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hash,
      role:role?role:"buyer",
    });
    console.log("user",newUser)
    return res.status(201).send({ success: true,data:newUser, msg: "User is registered" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, err: error });
  }
};

exports.Login = async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, msg: "Provide all the fields" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .send({ success: false, msg: "Invalid email or password" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .send({ success: false, msg: "Invalid email or password" });
    }

    const token = await jwt.sign(
      { UserId: user.id, role: user.role },
      process.env.secret
    );
    return res
      .status(200)
      .send({ success: true, msg: "login succesfully", token, data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, err: error });
  }
};
