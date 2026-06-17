import { Router } from "express";
import {
	createTaskHandler,
	deleteTaskHandler,
	getTasksHandler,
	updateTaskHandler,
} from "../controllers/taskController";

const router = Router();

router.post("/", createTaskHandler);
router.get("/", getTasksHandler);
router.patch("/:id", updateTaskHandler);
router.delete("/:id", deleteTaskHandler);

export default router;
