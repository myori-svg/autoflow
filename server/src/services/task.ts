import { Task } from "../models/Task";

type TaskInput = {
	title: string;
	start: Date;
	end: Date;
};

export async function createTask(input: TaskInput) {
	return Task.create(input);
}

export async function listTasks() {
	return Task.find().sort({ start: 1 });
}

export async function updateTaskSchedule(
	id: string,
	schedule: { start: Date; end: Date },
) {
	return Task.findByIdAndUpdate(id, schedule, { new: true });
}
