import express from "express";
import { deleteUser, getUser, signoutUser, test, update } from "../controllers/user.controller.js";
import {verifyToken} from "../utils/verifyToken.js"

const router = express.Router();

router.get("/test" ,test)
router.put("/update/:id",verifyToken,update)
router.delete("/delete/:id",verifyToken,deleteUser)
router.post("/signout", signoutUser)
router.get("/getusers",verifyToken,getUser)

export default router