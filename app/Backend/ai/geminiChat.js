const { GoogleGenerativeAI } = require('@google/generative-ai')
const messageModel = require('../models/chat/messageModel')
// import dotenv from 'dotenv'
// dotenv.config()

const gemini_api_key = process.env.GEMINI_API_KEY
const googleAI = new GoogleGenerativeAI(gemini_api_key)
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 200,
}

const geminiModel = googleAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  geminiConfig,
})

const generateChat = async (
  { message: prompt, sender, receiver },
  handleMessage
) => {
  const messages = await messageModel.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  })
  const history = messages.map((message) => {
    return {
      role: sender === process.env.GOOGLE_AI_ID ? 'model' : 'user',
      parts: [{ text: message.message }],
    }
  })

  // const history = [
  //   {
  //     role: 'user',
  //     parts: [
  //       {
  //         text: 'Hello, I have 2 dogs in my house.',
  //       },
  //     ],
  //   },
  //   {
  //     role: 'model',
  //     parts: [
  //       {
  //         text: 'Great to meet you.',
  //       },
  //     ],
  //   },
  // ]
  try {
    const chat = geminiModel.startChat({
      history,
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
