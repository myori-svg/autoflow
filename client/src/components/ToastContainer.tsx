import type { Toast, ToastType } from "../hooks/useToast";

type Props = {
	toasts: Toast[];
	onDismiss: (id: number) => void;
};

const STYLES: Record<ToastType, string> = {
	success: "bg-green-50 border-green-200 text-green-800",
	error: "bg-red-50 border-red-200 text-red-800",
	info: "bg-blue-50 border-blue-200 text-blue-800",
};

const ICONS: Record<ToastType, string> = {
	success: "✓",
	error: "✕",
	info: "ℹ",
};

export function ToastContainer({ toasts, onDismiss }: Props) {
	if (toasts.length === 0) return null;

	return (
		<div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm shadow-md animate-in ${STYLES[toast.type]}`}
				>
					<span className="mt-0.5 font-bold shrink-0">{ICONS[toast.type]}</span>
					<span className="flex-1 leading-snug">{toast.message}</span>
					<button
						type="button"
						onClick={() => onDismiss(toast.id)}
						className="ml-1 shrink-0 opacity-50 hover:opacity-100 transition-opacity text-base leading-none"
					>
						×
					</button>
				</div>
			))}
		</div>
	);
}
