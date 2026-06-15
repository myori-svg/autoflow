import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type Props = {
	selected?: Date;
	onSelect: (date: Date | undefined) => void;
	error?: string;
	touched?: boolean;
};

const DEFAULT_HOUR = 23;
const DEFAULT_MINUTE = 59;

function toTimeInputValue(date: Date): string {
	return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function withTime(date: Date, hours: number, minutes: number): Date {
	const result = new Date(date);
	result.setHours(hours, minutes, 0, 0);
	return result;
}

export function DatePicker({ selected, onSelect, error, touched }: Props) {
	const [open, setOpen] = useState(false);

	const handleSelect = (date: Date | undefined) => {
		if (!date) {
			onSelect(undefined);
			setOpen(false);
			return;
		}

		const time = selected
			? { hours: selected.getHours(), minutes: selected.getMinutes() }
			: { hours: DEFAULT_HOUR, minutes: DEFAULT_MINUTE };

		onSelect(withTime(date, time.hours, time.minutes));
		setOpen(false);
	};

	const handleTimeChange = (value: string) => {
		if (!selected || !value) return;
		const [hours, minutes] = value.split(":").map(Number);
		onSelect(withTime(selected, hours, minutes));
	};

	const formatDate = (date: Date) =>
		date.toLocaleString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	const showError = touched && !selected;

	return (
		<div className="flex flex-col gap-1 relative">
			<label className="text-sm font-medium text-gray-700">
				마감일 <span className="text-gray-400">(선택)</span>
			</label>
			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => setOpen((prev) => !prev)}
					className={[
						"flex-1 rounded-md border px-3 py-2 text-sm text-left outline-none transition-colors",
						"focus:ring-2 focus:ring-blue-500",
						showError || error
							? "border-red-400 text-gray-400 focus:ring-red-400"
							: "border-gray-300 text-gray-700 hover:border-gray-400",
					].join(" ")}
				>
					{selected ? formatDate(selected) : "날짜와 시간을 선택하세요"}
				</button>
				{selected && (
					<input
						type="time"
						value={toTimeInputValue(selected)}
						onChange={(e) => handleTimeChange(e.target.value)}
						className="rounded-md border border-gray-300 px-2 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				)}
			</div>
			{(showError || error) && (
				<span className="text-xs text-red-500">
					{error ?? "마감일을 선택해주세요."}
				</span>
			)}
			{open && (
				<div className="absolute top-full mt-1 z-10 bg-white rounded-xl border border-gray-200 shadow-lg p-2">
					<DayPicker
						mode="single"
						selected={selected}
						onSelect={handleSelect}
						disabled={{ before: new Date() }}
						today={new Date()}
					/>
				</div>
			)}
		</div>
	);
}
