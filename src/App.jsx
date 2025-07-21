import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [addHashtags, setAddHashtags] = useState(false)
  const [addBullets, setAddBullets] = useState(false)

  async function generateTLDR() {
    if (!question.trim()) return
    setLoading(true)
    setAnswer('')
    try {
      let prompt = `Give me a TLDR:\n${question}`
      if (addBullets) prompt += '\nFormat it using bullet points.'
      if (addHashtags) prompt += '\nAdd relevant hashtags at the end.'

      const res = await axios({
        method: 'POST',
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        data: {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
      })
      const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary found.'
      setAnswer(text)
    } catch (error) {
      console.error(error)
      setAnswer('⚠️ Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-black min-h-screen w-full flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-20 left-1/2 w-[150%] h-[150%] bg-gradient-to-br from-fuchsia-700 to-indigo-600 opacity-10 blur-3xl rounded-full animate"></div>

      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-3xl text-white relative z-10 space-y-6 border border-white/20">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-indigo-300 drop-shadow-md">
          ✨ TL;DR Genie
        </h1>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Paste your long text here..."
          className="w-full h-40 p-4 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Checkboxes */}
        <div className="flex gap-6 justify-center text-sm font-medium text-indigo-200">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={addBullets}
              onChange={() => setAddBullets(!addBullets)}
              className="form-checkbox h-4 w-4 text-indigo-500"
            />
            <span>Bullet Points</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={addHashtags}
              onChange={() => setAddHashtags(!addHashtags)}
              className="form-checkbox h-4 w-4 text-indigo-500"
            />
            <span>Add Hashtags</span>
          </label>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={generateTLDR}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 text-white px-8 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50"
          >
            {loading ? 'Summoning ✨' : 'Generate TL;DR'}
          </button>
        </div>

        {/* Loading animation */}
        {loading && (
          <div className="flex justify-center items-center space-x-2 pt-2">
            <span className="text-indigo-300 text-sm">Thinking</span>
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-150">.</span>
            <span className="animate-bounce delay-300">.</span>
          </div>
        )}

        {/* Output */}
        {answer && (
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 transition-all duration-500 animate-fade-in">
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">Summary:</h2>
            <p className="text-gray-200 whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
