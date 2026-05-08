import { ApiError, Citation, QueryRequest } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Stream Query to Kora ─────────────────────────────────────────────────────

export async function streamKoraQuery(
  request: QueryRequest,
  onChunk: (chunk: string) => void,
  onCitations: (citations: Citation[]) => void,
  onError: (error: ApiError) => void,
  onDone: () => void,
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const detail = errorData.detail;
      const code =
        typeof detail === "object" && detail?.code
          ? detail.code
          : mapStatusToCode(response.status, undefined);
      onError({
        message:
          typeof detail === "object" && detail?.message
            ? detail.message
            : "Something went wrong.",
        code,
      });
      return;
    }

    if (!response.body) {
      onError({
        message: "No response body received.",
        code: "SERVICE_UNAVAILABLE",
      });
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        onDone();
        break;
      }

      const raw = decoder.decode(value, { stream: true });
      const lines = raw.split("\n").filter((line) => line.trim() !== "");

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const data = line.replace("data: ", "").trim();

        if (data === "[DONE]") {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data);

          if (parsed.type === "chunk") {
            onChunk(parsed.content);
          } else if (parsed.type === "citations") {
            onCitations(parsed.citations);
          } else if (parsed.type === "error") {
            onError({
              message: parsed.message,
              code: parsed.code,
            });
            return;
          }
        } catch {
          // Non-JSON line, skip
        }
      }
    }
  } catch {
    onError({
      message: "Could not reach Kora. Please try again.",
      code: "SERVICE_UNAVAILABLE",
    });
  }
}

// ─── Health Check ─────────────────────────────────────────────────────────────

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapStatusToCode(
  status: number,
  serverCode?: string,
): ApiError["code"] {
  if (serverCode) return serverCode as ApiError["code"];
  switch (status) {
    case 429:
      return "RATE_LIMITED";
    case 422:
      return "INPUT_TOO_LONG";
    case 503:
      return "SERVICE_UNAVAILABLE";
    default:
      return "SERVICE_UNAVAILABLE";
  }
}
