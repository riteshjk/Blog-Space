import express from "express";
import { createComment } from "../controllers/createComment.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create",verifyToken, createComment)

export default router