import { type ChatRequest, streamChat } from "@/features/ai/api/chat"
import { GroqUnavailableError, isGroqConfigured } from "@/shared/api/groq"

export async function POST(request: Request) {
  if (!isGroqConfigured()) {
    return Response.json({ error: "GROQ_API_KEY is not set" }, { status: 503 })
  }
  try {
    const body = (await request.json()) as ChatRequest
    const stream = await streamChat(body, request.signal)
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    if (error instanceof GroqUnavailableError) {
      return Response.json(
        { error: "AI quota reached", retryAfter: error.retryAfterSeconds },
        {
          status: 429,
          headers: { "Retry-After": String(error.retryAfterSeconds || 60) },
        }
      )
    }
    console.error(error)
    return Response.json({ error: "AI unavailable" }, { status: 502 })
  }
}
