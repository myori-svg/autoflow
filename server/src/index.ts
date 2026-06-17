import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import aiRouter from "./routes/ai";
import feedbackRouter from "./routes/feedback";
import taskRouter from "./routes/tasks";
import workHoursRouter from "./routes/workHours";
import { connectDB } from "./services/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/api/ai", aiRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/work-hours", workHoursRouter);

app.use(
	(
		err: Error,
		_req: express.Request,
		res: express.Response,
		_next: express.NextFunction,
	) => {
		console.error(err.stack);
		res.status(500).json({ error: "Internal Server Error" });
	},
);

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});
