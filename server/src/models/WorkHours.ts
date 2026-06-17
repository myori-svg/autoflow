import { model, Schema } from "mongoose";

export type DayOverride = {
	day: number;
	enabled: boolean;
	start: string;
	end: string;
};

type WorkHoursDocument = {
	defaultStart: string;
	defaultEnd: string;
	overrides: DayOverride[];
};

const dayOverrideSchema = new Schema<DayOverride>(
	{
		day: { type: Number, required: true, min: 0, max: 6 },
		enabled: { type: Boolean, required: true, default: true },
		start: { type: String, required: true },
		end: { type: String, required: true },
	},
	{ _id: false },
);

const workHoursSchema = new Schema<WorkHoursDocument>({
	defaultStart: { type: String, default: "09:00" },
	defaultEnd: { type: String, default: "18:00" },
	overrides: { type: [dayOverrideSchema], default: [] },
});

export const WorkHours = model<WorkHoursDocument>("WorkHours", workHoursSchema);
