import { useState } from "react";
import { estimateTask } from "../api/ai";
import type { EstimateResponse } from "../types";

type UseScheduleReturn = {
	scheduling: boolean;
	result: EstimateResponse | null;
	handleAutoSchedule: (title: string, deadline: Date) => Promise<void>;
};

export function useSchedule(): UseScheduleReturn {
	const [scheduling, setScheduling] = useState(false);
	const [result, setResult] = useState<EstimateResponse | null>(null);

	const handleAutoSchedule = async (title: string, deadline: Date) => {
		setScheduling(true);
		try {
			const data = await estimateTask(title, deadline);
			setResult(data);
			alert(
				`예상 소요 시간: ${data.estimatedHours}시간\n근거: ${data.reasoning}`,
			);
		} catch (err) {
			alert(err instanceof Error ? err.message : "AI 추정에 실패했습니다.");
		} finally {
			setScheduling(false);
		}
	};

	return { scheduling, result, handleAutoSchedule };
}
