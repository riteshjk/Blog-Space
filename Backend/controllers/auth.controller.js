import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errHandler } from "../utils/err.js";
export const userSignup = async (req, res,next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username == " " ||
    email == " " ||
    password == " "
  ) {
    next(errHandler(400, "All fields are required"))
  } else {
    const hasPassword =  bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password:hasPassword,
    });
    try{
        await newUser.save();
        res.send({ newUser, message: "User created successfully" });
    }
    catch(err){
        next(err)
    }
    
  }
};
