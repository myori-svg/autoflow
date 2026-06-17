import { useCallback, useEffect, useState } from "react";
import {
	fetchWorkHours,
	updateWorkHours as updateWorkHoursApi,
} from "../api/workHours";
import type { WorkHours } from "../types";

const DEFAULT_WORK_HOURS: WorkHours = {
	defaultStart: "09:00",
	defaultEnd: "18:00",
	overrides: [],
};

type OverrideInput = { start: string; end: string; enabled: boolean };

type UseWorkHoursReturn = {
	workHours: WorkHours;
	saveDefault: (start: string, end: string) => Promise<void>;
	saveOverride: (day: number, override: OverrideInput | null) => Promise<void>;
};

export function useWorkHours(): UseWorkHoursReturn {
	const [workHours, setWorkHours] = useState<WorkHours>(DEFAULT_WORK_HOURS);

	useEffect(() => {
		fetchWorkHours()
			.then(setWorkHours)
			.catch((err) => console.error(err));
	}, []);

	const saveDefault = useCallback(async (start: string, end: string) => {
		const updated = await updateWorkHoursApi({
			defaultStart: start,
			defaultEnd: end,
		});
		setWorkHours(updated);
	}, []);

	const saveOverride = useCallback(
		async (day: number, override: OverrideInput | null) => {
			const nextOverrides = workHours.overrides.filter((o) => o.day !== day);
			if (override) {
				nextOverrides.push({ day, ...override });
			}
			const updated = await updateWorkHoursApi({ overrides: nextOverrides });
			setWorkHours(updated);
		},
		[workHours.overrides],
	);

	return { workHours, saveDefault, saveOverride };
}
