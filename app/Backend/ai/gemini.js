const { GoogleGenerativeAI } = require('@google/generative-ai')
// import dotenv from 'dotenv'
// dotenv.config()

const gemini_api_key = process.env.GEMINI_API_KEY
const googleAI = new GoogleGenerativeAI(gemini_api_key)
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
}

const geminiModel = googleAI.getGenerativeModel({
  model: 'gemini-pro',
  geminiConfig,
})

const generate = async (prompt) => {
  try {
    const result = await geminiModel.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.log('response error', error)
  }
}

module.exports = generate
