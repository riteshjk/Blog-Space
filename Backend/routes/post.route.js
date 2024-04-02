import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { create, deletePost, getPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create",verifyToken,create)
router.get("/getposts",getPosts)
router.delete("/delete/:postId/:userId",verifyToken,deletePost)

export default router