import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { create, deletePost, getPosts, updateLastPost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create",verifyToken,create)
router.get("/getposts",getPosts)
router.delete("/delete/:postId/:userId",verifyToken,deletePost)
router.put("/updatepost/:postId/:userId",verifyToken,updateLastPost)

export default router