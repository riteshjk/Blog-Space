import Post from '../models/post.model.js';
import { errHandler } from '../utils/err.js';

export const create = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errHandler(403, "You are not allowed to do that"))
    }
    if(!req.body.title || !req.body.content){
        return next(errHandler(400, "All fields are required"))
    }
    const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const newPost=new Post({
        ...req.body,
        slug,
        userId: req.user.id
    })
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(err){
        next(err)
    }
}
