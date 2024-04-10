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

export const getPostComments = async (req, res, next) => {
    try {
      const comments = await Comment.find({ postId: req.params.postId }).sort({
        createdAt: -1,
      });
  
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };

  export const likeComment = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, "Commentnot found"));
      }
      const userIndex = comment.likes.indexOf(req.user.id);
      if (userIndex === -1) {
        comment.numberOfLikes += 1;
        comment.likes.push(req.user.id);
      } else {
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndex, 1);
      }
  
      await comment.save();
      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  };

  export const editComment =async(req,res,next) =>{
    try{
      const comment = await Comment.findById(req.params.commentId);
      if(!comment) return next(errHandler(404, "Comment not found"))
      if(req.user.id !== comment.userId && !req.user.isAdmin) return next(errHandler(403, "You are not allowed to edit this comment"))

      const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
        content: req.body.content,
        
      },
      { new: true }
      );
      res.status(200).json(editedComment)
    }
    catch(errHandler){
        next(errHandler)
    }
  }