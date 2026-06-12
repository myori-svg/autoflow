export type EstimateResponse = {
	estimatedHours: number;
	reasoning: string;
};

export type ScheduledTask = {
	id: string;
	title: string;
	start: string;
	end: string;
};

export type Task = {
	_id: string;
	title: string;
	start: string;
	end: string;
};
