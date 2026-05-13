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
          content: `You are a helpful library assistant for a library management system. You have access to the complete catalog of books in this library.

Here is the current library catalog data:
${booksContext}

Your role is to:
1. Answer questions about the books in this specific library (counts, authors, genres, availability, etc.)
2. Provide book recommendations based on user preferences, using books available in this library
3. Help users find books by genre, author, title, or topic
4. Answer factual questions about the catalog (e.g., how many books, which authors, which genres)

Always base your answers on the actual data provided above. Be concise, helpful, and accurate. If asked about something not in the catalog, let the user know the library doesn't have it but feel free to suggest similar books that ARE in the catalog.
Format responses clearly. For lists, use simple numbered or bullet format. Keep responses focused and useful.`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    })
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(JSON.stringify(err))
  }

  const data = await response.json()
  return data.choices[0].message.content
}