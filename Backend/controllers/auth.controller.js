import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errHandler } from "../utils/err.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
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

export const userLogin = async(req,res,next) =>{
  const { email, password} = req.body;
  if(!email || !password || email == " " || password == ""){
    next(errHandler(400, "All fields are required"))
  }
  try{
    const validUser = await User.findOne({email});
    if(!validUser){
      return next(errHandler(400, "User does not exist"))
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword){
     return next(errHandler(400, "Invalid password"))
    }

    const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET) 
    res.status(200).cookie("token",token,{
      httpOnly:true,
    }).send({
      validUser,
      token
    }).json(validUser)
  }
  catch(err){
    next(err)
  }
  
}

export const googleOAuth = async (req, res, next) => {
  const { email, name, image } = req.body;
  
  try {
      const userPresent = await User.findOne({ email });
      if (userPresent) {
        console.log(email, name, image,"abc")
          const token = jwt.sign({ id: userPresent._id }, process.env.JWT_SECRET);
          const { password, ...rest } = userPresent._doc;
          res.status(200).cookie("token", token, {
              httpOnly: true,
          }).send({
              userPresent,
              token
          }).json(rest);
      } else {
        //console.log(email, name, image)
          const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
          const username = name ? name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4) : ""; // Check if name is defined
          const newUser = new User({
              username,
              email,
              password: hashedPassword,
              profilePic: image
          });
          await newUser.save();
          const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
          const { password, ...rest } = newUser._doc;
          res.status(200).cookie("token", token, {
              httpOnly: true,
          })
          .send({
              newUser,
              token
          })
          .json(rest);
      }
  } catch (err) {
      next(err);
  }
}