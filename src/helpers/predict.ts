// src/helpers/predict.ts
export type PredictPayload = Record<string, any>;

export async function callPredict(payload: PredictPayload): Promise<any> {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const res = await fetch(`${API}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok) {
    // try to parse JSON error body, else throw raw text
    try {
      const parsed = JSON.parse(text);
      throw new Error(parsed.detail || parsed.error || JSON.stringify(parsed));
    } catch {
      throw new Error(text || res.statusText);
    }
  }

  // parse JSON response
  try {
    return JSON.parse(text);
  } catch {
    // fallback: if backend returned something strange, return text
    return text;
  }
}
