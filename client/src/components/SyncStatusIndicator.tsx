import type { SyncStatus } from "../hooks/useTasks";

type SyncStatusIndicatorProps = {
	status: SyncStatus;
};

const STATUS_CONFIG: Record<
	SyncStatus,
	{ label: string; className: string } | null
> = {
	idle: null,
	syncing: { label: "동기화 중...", className: "bg-gray-100 text-gray-600" },
	synced: { label: "동기화 완료", className: "bg-green-100 text-green-700" },
	error: { label: "동기화 실패", className: "bg-red-100 text-red-700" },
};

export function SyncStatusIndicator({ status }: SyncStatusIndicatorProps) {
	const config = STATUS_CONFIG[status];
	if (!config) return null;

	return (
		<div
			className={`fixed bottom-4 right-4 rounded-full px-4 py-2 text-sm font-medium shadow-sm ${config.className}`}
		>
			{config.label}
		</div>
	);
}
