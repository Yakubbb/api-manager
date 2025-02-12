'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getAnswer(question: string, modelName: string = 'gemini-2.0-flash', history?: string) {
    console.log('aboba')
    console.log(process.env.GOOGLE_API_KEY)
    if (process.env.GOOGLE_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat()

        const prompt = "привет";

        const resultStream = await chat.sendMessageStream(prompt);

        return resultStream
    }
    else {
        console.log(process.env.GOOGLE_API_KEY)
    }
}