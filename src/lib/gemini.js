const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

export async function queryGemini(userMessage, booksData) {
  const booksContext = JSON.stringify(booksData, null, 2)

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a helpful library assistant. You have access to this library's full catalog:\n${booksContext}\n\nAnswer questions about the books, give recommendations, and provide catalog statistics based only on this data.`
        },
        { role: "user", content: userMessage }
      ],
      max_tokens: 1024,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(JSON.stringify(err))
  }

  const data = await response.json()
  return data.choices[0].message.content
}