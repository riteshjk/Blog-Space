import Comment from "../models/Comment.model.js";
import { errHandler } from "../utils/err.js";
export const createComment = async(req,res,next) =>{
    // console.log(req.body,"hi")
    try{
         const { userId, postId, content } = req.body
         console.log(req.user)
        if(userId !== req.user.id){
            return next(errHandler(403, "You are not allowed to create this comment"))
        }
        const newComment = new Comment({
            userId,
            postId,
            content
        });
       await newComment.save();
        res.status(200).json(newComment)
    }
    catch(errHandler){
        next(errHandler)
    }
}