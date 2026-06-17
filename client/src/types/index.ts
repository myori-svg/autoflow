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
	estimatedHours?: number;
};

export type TaskUpdateInput = {
	title?: string;
	description?: string;
	priority?: TaskPriority;
	deadline?: string;
	start?: string;
	end?: string;
	estimatedHours?: number;
	unschedule?: boolean;
};

export type DetailTask = {
	id: string;
	title: string;
	description?: string;
	priority: TaskPriority;
	start?: string;
	end?: string;
	deadline?: string;
	estimatedHours?: number;
};

export type CreateTaskInput = {
	title: string;
	deadline?: string;
	start?: string;
	end?: string;
	estimatedHours?: number;
};

export type DayOverride = {
	day: number;
	enabled: boolean;
	start: string;
	end: string;
};

export type WorkHours = {
	defaultStart: string;
	defaultEnd: string;
	overrides: DayOverride[];
};
