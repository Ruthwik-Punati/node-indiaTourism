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

const generateChat = async (prompt, handleMessage) => {
  try {
    const chat = geminiModel.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    })

    const result = await chat.sendMessageStream(prompt)
    let text = ''
    for await (const chunk of result.stream) {
      const chunkText = await chunk.text()
      await handleMessage(chunkText)
      console.log(chunkText)
      text += chunkText
    }
    // const response = await result.response
    // const text = await response.text()
    // console.log(response)
    // return text
  } catch (error) {
    console.log('response error', error)
  }
}

module.exports = generateChat
