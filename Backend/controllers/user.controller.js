import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import { errHandler } from "../utils/err.js"
export const test =(req,res) =>{
    res.send("test")
}


export const update= async(req,res,next) =>{
    console.log(req.user,"sandeep");
    console.log(req.params.id,"ritesh");
    if(req.user.id != req.params.id){
        return next(errHandler(403, "You can update only your account"))
    }
    if(req.body.password ){
        if(req.body.password.length < 6){
            return next(errHandler(400, "Password must be at least 6 characters long"))

        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if(req.body.username){
        if(req.body.username.length< 7 || req.body.username.length > 15){
            return next(errHandler(400, "Username must be between 7 and 15 characters long"))
        }
        if(req.body.username.includes(" ")){
            return next(errHandler(400, "Username cannot contain spaces"))
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errHandler(400, "Username must be lowercase"))
        }
    
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errHandler(400, "Username must contain only letters and numbers"))
        }
    }
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set : {
                    username : req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePic: req.body.profilePic

                },
            },
            {new:true});
            const {password, ...rest} = updatedUser._doc
            res.status(200).send(rest)
        }
        catch(err){
            next(err)
        }

        }
    
export const deleteUser = async(req,res,next) =>{
    if(req.user.id != req.params.id){
        return next(errHandler(403, "You can update only your account"))
    }

    try{

        await User.findByIdAndDelete(req.params.id)
        res.status(200).send("User has been deleted")
    }
    catch(err){
        next(err)
    }
}

export const signoutUser = async(req,res,next) =>{
try{
    res.clearCookie("access_token")
    res.status(200).send("User has been signed out")
}
catch(err){
    next(err)
}
}