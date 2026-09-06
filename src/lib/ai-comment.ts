// 모델은 gemini-3.5-flash로 고정
const MODEL = "gemini-3.5-flash";

const SYSTEM_PROMPT =
  "당신은 '매출 정보' 게시판의 AI 도우미입니다. 새로 올라온 게시글을 읽고 한국어로 2~3문장의 짧고 담백한 댓글을 답니다. " +
  "인사말이나 자기소개 없이 본론만 쓰고, 과장하지 않습니다. 도움이 되면 후속 질문을 하나 덧붙일 수 있습니다.";

/**
 * 게시글 제목/내용을 받아 Gemini로 짧은 댓글 텍스트를 생성한다.
 * 키가 없거나 응답이 비면 null을 반환한다 (댓글 생성은 best-effort).
 */
export async function generateAiComment(
  title: string,
  content: string,
): Promise<string | null> {
  const apiKey = process.env.GEMINI_AI_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: `제목: ${title}\n내용: ${content}` }] }],
        generationConfig: { maxOutputTokens: 2000, temperature: 0.7 },
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  const parts: unknown = json?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts)
    ? parts
        .map((p) => (typeof p?.text === "string" ? p.text : ""))
        .join("")
        .trim()
    : "";

  return text || null;
}
