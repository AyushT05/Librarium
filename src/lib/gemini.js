const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

export async function queryGemini(userMessage, booksData) {
  const booksContext = JSON.stringify(booksData, null, 2)

  const systemPrompt = `You are a helpful library assistant for a library management system. You have access to the complete catalog of books in this library. 

Here is the current library catalog data:
${booksContext}

Your role is to:
1. Answer questions about the books in this specific library (counts, authors, genres, availability, etc.)
2. Provide book recommendations based on user preferences, using books available in this library
3. Help users find books by genre, author, title, or topic
4. Answer factual questions about the catalog (e.g., how many books, which authors, which genres)

Always base your answers on the actual data provided above. Be concise, helpful, and accurate. If asked about something not in the catalog, let the user know the library doesn't have it but feel free to suggest similar books that ARE in the catalog.

Format responses clearly. For lists, use simple numbered or bullet format. Keep responses focused and useful.`

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: systemPrompt + '\n\nUser question: ' + userMessage }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    }
  }

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'Gemini API error')
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.'
}
