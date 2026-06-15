import { Router } from "express";
import {
	createTaskHandler,
	getTasksHandler,
	updateTaskHandler,
} from "../controllers/taskController";

const router = Router();

router.post("/", createTaskHandler);
router.get("/", getTasksHandler);
router.patch("/:id", updateTaskHandler);

export default router;
