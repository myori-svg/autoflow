import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type Props = {
	selected?: Date;
	onSelect: (date: Date | undefined) => void;
	error?: string;
	touched?: boolean;
};

export function DatePicker({ selected, onSelect, error, touched }: Props) {
	const [open, setOpen] = useState(false);

	const handleSelect = (date: Date | undefined) => {
		onSelect(date);
		setOpen(false);
	};

	const formatDate = (date: Date) =>
		date.toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

	const showError = touched && !selected;

	return (
		<div className="flex flex-col gap-1 relative">
			<label className="text-sm font-medium text-gray-700">
				마감일 <span className="text-red-500">*</span>
			</label>
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className={[
					"rounded-md border px-3 py-2 text-sm text-left outline-none transition-colors",
					"focus:ring-2 focus:ring-blue-500",
					showError || error
						? "border-red-400 text-gray-400 focus:ring-red-400"
						: "border-gray-300 text-gray-700 hover:border-gray-400",
				].join(" ")}
			>
				{selected ? formatDate(selected) : "날짜를 선택하세요"}
			</button>
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
