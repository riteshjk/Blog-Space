import express from 'express';
import { googleOAuth, userSignup,userLogin } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/signup", userSignup)
router.post("/login", userLogin)
router.post("/google", googleOAuth)

export default router