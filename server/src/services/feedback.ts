import { Feedback } from "../models/Feedback";

type FeedbackStats = {
	total: number;
	accurateRate: number;
	tooLongRate: number;
	tooShortRate: number;
};

export async function getFeedbackStats(): Promise<FeedbackStats | null> {
	const total = await Feedback.countDocuments();
	if (total === 0) return null;

	const [accurate, tooLong, tooShort] = await Promise.all([
		Feedback.countDocuments({ actualResult: "accurate" }),
		Feedback.countDocuments({ actualResult: "too_long" }),
		Feedback.countDocuments({ actualResult: "too_short" }),
	]);

	return {
		total,
		accurateRate: Math.round((accurate / total) * 100),
		tooLongRate: Math.round((tooLong / total) * 100),
		tooShortRate: Math.round((tooShort / total) * 100),
	};
}

export function buildFeedbackContext(stats: FeedbackStats): string {
	return `과거 추정 피드백 (${stats.total}건): 딱 맞음 ${stats.accurateRate}%, 오래 걸림 ${stats.tooLongRate}%, 일찍 끝냄 ${stats.tooShortRate}%. 이 패턴을 반영해 추정값을 조정하세요.`;
}
