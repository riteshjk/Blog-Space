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

export const getPosts = async(req,res,next) =>{
    
    try{
        const startIndex = parseInt(req.query.startIndex || 0);
        const limit = parseInt(req.query.limit || Number.MAX_SAFE_INTEGER)
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && {userId: req.query.userId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or: [
                    {title: {$regex: req.query.searchTerm, $options: "i"}},
                    {content: {$regex: req.query.searchTerm, $options: "i"}},
                ],
            }),
        }).sort({createdAt: sortDirection}).skip(startIndex).limit(limit);
        const totalPosts = await Post.countDocuments();
        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthsPosts = await Post.countDocuments({
            createdAt: {
                $gte: oneMonthAgo,
            },
        });

        res.status(200).json({posts, totalPosts, lastMonthsPosts});

    }
    catch(err){
        next(err)
    }
}
