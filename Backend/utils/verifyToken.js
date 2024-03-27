import  jwt  from "jsonwebtoken";
import {errHandler} from "../utils/err.js"

export const verifyToken = async(req,res,next) =>{
    const token = req.cookies?.access_token;
    if(!token){
        return next(errHandler(401, "Please login to access this resource"))
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
        if(err){
            return next(errHandler(401, "Please login to access this resource"))
        }
        req.user = user;
        next()
    })
}