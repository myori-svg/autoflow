import { Router } from "express";
import { saveFeedbackHandler } from "../controllers/feedbackController";

const router = Router();

router.post("/", saveFeedbackHandler);

export default router;
