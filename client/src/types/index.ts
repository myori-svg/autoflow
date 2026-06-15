export type EstimateResponse = {
	estimatedHours: number;
	reasoning: string;
};

export type TaskPriority = "low" | "medium" | "high";

export type ScheduledTask = {
	id: string;
	title: string;
	description?: string;
	priority: TaskPriority;
	start: string;
	end: string;
};

export type Task = {
	_id: string;
	title: string;
	description?: string;
	priority: TaskPriority;
	deadline?: string;
	start?: string;
	end?: string;
	scheduled: boolean;
};

export type TaskUpdateInput = {
	title?: string;
	description?: string;
	priority?: TaskPriority;
	deadline?: string;
	start?: string;
	end?: string;
};

export type CreateTaskInput = {
	title: string;
	deadline?: string;
	start?: string;
	end?: string;
};
