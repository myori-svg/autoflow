import { useCallback, useRef, useState } from "react";

export type ToastType = "success" | "error" | "info";

export type Toast = {
	id: number;
	message: string;
	type: ToastType;
};

const TOAST_DURATION_MS = 4000;

export function useToast() {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const counter = useRef(0);

	const show = useCallback((message: string, type: ToastType = "info") => {
		const id = ++counter.current;
		setToasts((prev) => [...prev, { id, message, type }]);
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, TOAST_DURATION_MS);
	}, []);

	const dismiss = useCallback((id: number) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return { toasts, show, dismiss };
}
