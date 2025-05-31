import express from "express"
import { getTodayPrompt, sendPrompt } from "../controller/prompt.controller.js"
import userMiddleware from "../middleware/promptMiddleware.js"

const router = express.Router()

router.post("/prompt", userMiddleware, sendPrompt)
router.get("/today-prompt", userMiddleware, getTodayPrompt)


export default router