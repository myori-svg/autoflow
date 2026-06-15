import { model, Schema } from "mongoose";

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

type TaskDocument = {
	title: string;
	description?: string;
	priority: TaskPriority;
	start: Date;
	end: Date;
};

const taskSchema = new Schema<TaskDocument>(
	{
		title: { type: String, required: true },
		description: { type: String },
		priority: {
			type: String,
			enum: TASK_PRIORITIES,
			default: "medium",
		},
		start: { type: Date, required: true },
		end: { type: Date, required: true },
	},
	{ timestamps: { createdAt: true, updatedAt: true } },
);

export const Task = model<TaskDocument>("Task", taskSchema);
