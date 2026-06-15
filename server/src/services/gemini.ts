import { GoogleGenerativeAI } from "@google/generative-ai";

type EstimateInput = {
	title: string;
	description?: string;
	importance?: "low" | "medium" | "high";
	deadline: string;
	feedbackContext?: string;
};

type EstimateResult = {
	estimatedHours: number;
	reasoning: string;
};

const PROMPT_TEMPLATE = (input: EstimateInput) =>
	`
당신은 업무 소요 시간 추정 전문가입니다. 아래 할일 정보를 분석하여 예상 소요 시간을 추정해주세요.

할일 정보:
- 제목: ${input.title}
- 설명: ${input.description ?? "없음"}
- 중요도: ${input.importance ?? "medium"}
- 마감일: ${input.deadline}
- 현재 날짜: ${new Date().toISOString().split("T")[0]}
${input.feedbackContext ? `\n사용자 패턴:\n- ${input.feedbackContext}` : ""}
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:
{
  "estimatedHours": <숫자, 소수점 1자리까지>,
  "reasoning": "<한 줄 추정 근거>"
}
`.trim();

export async function estimateTaskDuration(
	input: EstimateInput,
): Promise<EstimateResult> {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");

	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

	const result = await model.generateContent(PROMPT_TEMPLATE(input));
	const text = result.response.text().trim();

	const jsonMatch = text.match(/\{[\s\S]*\}/);
	if (!jsonMatch) throw new Error("Gemini 응답에서 JSON을 파싱할 수 없습니다.");

	const parsed = JSON.parse(jsonMatch[0]) as EstimateResult;

	if (
		typeof parsed.estimatedHours !== "number" ||
		typeof parsed.reasoning !== "string"
	) {
		throw new Error("Gemini 응답 형식이 올바르지 않습니다.");
	}

	return parsed;
}
