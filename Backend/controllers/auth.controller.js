import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errHandler } from "../utils/err.js"
import jwt from "jsonwebtoken";


export const userSignup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json({ message: "Signup  succesful" });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);

  try {
    // Check if email and password are provided
    if (!email || !password || email.trim() === "" || password.trim() === "") {
      throw errHandler(400, "All fields are required");
    }

    // Find user by email
    const validUser = await User.findOne({ email });
    console.log("user", validUser);
    // If user not found, return error
    if (!validUser) {
      throw errHandler(404, "User not found");
    }

    // Check if password is valid
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      throw errHandler(400, "Invalid password");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: validUser._id,
        
      },
      process.env.JWT_SECRET
    );
    console.log("access",token)
    const { password: pass, ...rest } = validUser._doc;

    // Set token as a cookie and send user data in response
    res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
    })
      .json({...rest,token});
  } catch (error) {
    // Handle errors
    next(error);
  }
};




export const googleOAuth = async (req, res, next) => {
  const { email, name, image } = req.body;
   console.log(image);
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePic:image,
      });

      await newUser.save();
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {}
};