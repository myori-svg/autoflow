import { Router } from "express";
import {
	getWorkHoursHandler,
	updateWorkHoursHandler,
} from "../controllers/workHoursController";

const router = Router();

router.get("/", getWorkHoursHandler);
router.put("/", updateWorkHoursHandler);

export default router;
