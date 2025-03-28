'use server';

import { createStreamableValue } from 'ai/rsc';
import { IMessage } from '@/custom-types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    }
];


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generate2(
    history: IMessage[],
    modelName: string,
    temp: number,
    systemPrompt: string,
    person: IMessage[],
    harmCategories?: {
        harasment: HarmBlockThreshold
    }

) {

    const stream = createStreamableValue<{ type: 'error' | 'think' | 'text', msg: string, model?: string, person?: string, temp?: number } | undefined>();


    (async () => {

        try {
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
            const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: systemPrompt });

            console.log(person.concat(history).map((element) => {
                return {
                    role: element.role,
                    parts: element.parts
                }
            }),)

            
            const result = await model.generateContentStream({
                contents: person.concat(history).map((element) => {
                    return {
                        role: element.role,
                        parts: element.parts
                    }
                }),
                generationConfig: {
                    temperature: temp
                }
            }
            );

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                stream.update({ type: 'text', msg: chunkText, model: modelName, person: 'stock', temp: temp })
            }
        } catch (error: any) {
            switch (error.status) {
                case 404:
                    stream.update({ type: 'error', msg: 'модель не найдена', model: modelName, person: 'stock', temp: temp })
                    break;
                case 503:
                    stream.update({ type: 'error', msg: 'модель перегружена', model: modelName, person: 'stock', temp: temp })
                    break;
                default:
                    stream.update({ type: 'error', msg: 'произошла ошибка', model: modelName, person: 'stock', temp: temp })
                    break;

            }
        }
        finally {
            stream.done()
        }
    })()

    return { output: stream.value };
}

