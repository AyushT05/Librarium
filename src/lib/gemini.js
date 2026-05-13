const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

export async function queryGemini(userMessage, booksData) {
  const booksContext = JSON.stringify(booksData, null, 2)

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",

        messages: [
          {
            role: "system",
            content: `
You are a friendly and intelligent AI library assistant for a library management system.

You have full access to the library catalog provided below.

Library Catalog:
${booksContext}

Your responsibilities:
1. Answer questions about books in this library
2. Recommend books based on user interests
3. Help users discover books by genre, author, or topic
4. Answer factual questions about the catalog

Behavior Guidelines:
- Be warm, conversational, and helpful
- Sound like a real assistant, not a database
- Responses should feel natural and engaging
- You may add short friendly phrases when appropriate
- Keep answers informative without sounding robotic
- If the requested book is unavailable, politely say so and suggest similar available books

Formatting Rules:
- Use plain text only
- Do NOT use markdown formatting
- Do NOT use **bold**
- Do NOT use # headings
- Use numbered lists when listing books
- Keep formatting clean and readable

Example response style:

"We currently don't have mystery novels in the catalog, but here are some great books you might enjoy instead:

1. The Book Thief by Markus Zusak
2. The Kite Runner by Khaled Hosseini
3. To Kill a Mockingbird by Harper Lee"

Avoid overly short robotic replies like:
"There are 3 authors."
Instead say:
"There are currently 3 unique authors in the library catalog."
            `,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],

        temperature: 0.9,
        max_tokens: 1024,
      }),
    }
  )

  if (!response.ok) {
    const err = await response.json()
    console.error("Groq API Error:", err)
    throw new Error(err.error?.message || "Something went wrong")
  }

  const data = await response.json()

  let content = data.choices[0].message.content || ""

  // Cleanup in case markdown slips through
  content = content
    .replace(/\*\*/g, "")
    .replace(/#/g, "")
    .replace(/`/g, "")

  return content.trim()
}