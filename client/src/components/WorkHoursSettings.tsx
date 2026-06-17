import { useState } from "react";
import type { WorkHours } from "../types";

type OverrideInput = { start: string; end: string; enabled: boolean };

type Props = {
	workHours: WorkHours;
	onSaveDefault: (start: string, end: string) => void;
	onSaveOverride: (day: number, override: OverrideInput | null) => void;
};

const DAY_LABELS: { day: number; label: string }[] = [
	{ day: 1, label: "월" },
	{ day: 2, label: "화" },
	{ day: 3, label: "수" },
	{ day: 4, label: "목" },
	{ day: 5, label: "금" },
	{ day: 6, label: "토" },
	{ day: 0, label: "일" },
];

export function WorkHoursSettings({
	workHours,
	onSaveDefault,
	onSaveOverride,
}: Props) {
	const [expanded, setExpanded] = useState(false);

	const getOverride = (day: number) =>
		workHours.overrides.find((o) => o.day === day);

	const dayLabel = (day: number) =>
		DAY_LABELS.find((d) => d.day === day)?.label ?? "";

	const sortedOverrides = [...workHours.overrides].sort(
		(a, b) =>
			DAY_LABELS.findIndex((d) => d.day === a.day) -
			DAY_LABELS.findIndex((d) => d.day === b.day),
	);

	return (
		<div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-lg font-semibold text-gray-900">근무시간</h2>
				<button
					type="button"
					onClick={() => setExpanded((prev) => !prev)}
					className="text-xs font-medium text-blue-600 hover:underline"
				>
					{expanded ? "요일별 설정 닫기" : "요일별 세부설정"}
				</button>
			</div>

			<div className="flex items-center gap-2 text-sm">
				<input
					type="time"
					value={workHours.defaultStart}
					onChange={(e) => onSaveDefault(e.target.value, workHours.defaultEnd)}
					className="rounded-md border border-gray-300 px-2 py-1.5"
				/>
				<span className="text-gray-400">~</span>
				<input
					type="time"
					value={workHours.defaultEnd}
					onChange={(e) =>
						onSaveDefault(workHours.defaultStart, e.target.value)
					}
					className="rounded-md border border-gray-300 px-2 py-1.5"
				/>
				<span className="text-xs text-gray-400 shrink-0">(매일 기본값)</span>
			</div>

			{!expanded && sortedOverrides.length > 0 && (
				<div className="mt-2 flex flex-wrap gap-1.5">
					{sortedOverrides.map((o) => (
						<span
							key={o.day}
							className={[
								"rounded-full px-2 py-0.5 text-xs font-medium",
								o.enabled === false
									? "bg-red-50 text-red-500"
									: "bg-blue-50 text-blue-600",
							].join(" ")}
						>
							{dayLabel(o.day)}{" "}
							{o.enabled === false ? "휴무" : `${o.start}~${o.end}`}
						</span>
					))}
				</div>
			)}

			{expanded && (
				<div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
					{DAY_LABELS.map(({ day, label }) => {
						const override = getOverride(day);
						const isOff = override?.enabled === false;
						const isCustom = !!override && !isOff;
						return (
							<div key={day} className="flex items-center gap-2 text-sm">
								<span className="w-6 shrink-0 text-gray-700">{label}</span>

								<label className="flex items-center gap-1 text-xs text-red-500 shrink-0">
									<input
										type="checkbox"
										checked={isOff}
										onChange={(e) =>
											onSaveOverride(
												day,
												e.target.checked
													? {
															start: override?.start ?? workHours.defaultStart,
															end: override?.end ?? workHours.defaultEnd,
															enabled: false,
														}
													: null,
											)
										}
									/>
									휴무
								</label>

								{!isOff && (
									<>
										<label className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
											<input
												type="checkbox"
												checked={isCustom}
												onChange={(e) =>
													onSaveOverride(
														day,
														e.target.checked
															? {
																	start: workHours.defaultStart,
																	end: workHours.defaultEnd,
																	enabled: true,
																}
															: null,
													)
												}
											/>
											직접
										</label>
										<input
											type="time"
											disabled={!isCustom}
											value={override?.start ?? workHours.defaultStart}
											onChange={(e) =>
												onSaveOverride(day, {
													start: e.target.value,
													end: override?.end ?? workHours.defaultEnd,
													enabled: true,
												})
											}
											className="rounded-md border border-gray-300 px-2 py-1 text-xs disabled:bg-gray-50 disabled:text-gray-400"
										/>
										<span className="text-gray-400">~</span>
										<input
											type="time"
											disabled={!isCustom}
											value={override?.end ?? workHours.defaultEnd}
											onChange={(e) =>
												onSaveOverride(day, {
													start: override?.start ?? workHours.defaultStart,
													end: e.target.value,
													enabled: true,
												})
											}
											className="rounded-md border border-gray-300 px-2 py-1 text-xs disabled:bg-gray-50 disabled:text-gray-400"
										/>
									</>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
