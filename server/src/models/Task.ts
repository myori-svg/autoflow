import { model, Schema } from "mongoose";

type TaskDocument = {
	title: string;
	start: Date;
	end: Date;
};

const taskSchema = new Schema<TaskDocument>(
	{
		title: { type: String, required: true },
		start: { type: Date, required: true },
		end: { type: Date, required: true },
	},
	{ timestamps: { createdAt: true, updatedAt: true } },
);

export const Task = model<TaskDocument>("Task", taskSchema);
