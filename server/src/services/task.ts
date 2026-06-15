import { Task, type TaskPriority } from "../models/Task";

type TaskInput = {
	title: string;
	description?: string;
	priority?: TaskPriority;
	deadline?: Date;
	start?: Date;
	end?: Date;
	scheduled: boolean;
	estimatedHours?: number;
};

type TaskUpdate = Partial<TaskInput>;

export async function createTask(input: TaskInput) {
	return Task.create(input);
}

export async function listTasks() {
	return Task.find().sort({ start: 1 });
}

export async function updateTask(id: string, update: TaskUpdate) {
	return Task.findByIdAndUpdate(id, update, { new: true });
}
