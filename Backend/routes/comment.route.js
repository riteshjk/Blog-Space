import express from "express";
import { createComment, getPostComments, likeComment } from "../controllers/createComment.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create",verifyToken, createComment)
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);

export default router