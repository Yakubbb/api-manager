'use server';

import { CoreMessage, streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createStreamableValue } from 'ai/rsc';
import { IMessage } from '@/custom-types';



export async function generate(input: string) {
    
    console.log('aboba')
    const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY
    });

    const stream = createStreamableValue('');

    (async () => {
        const { textStream } = streamText({
            model: google('gemini-pro'),
            prompt: input,
            onError: (error) => console.log(error)
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })();

    return { output: stream.value };
}

export async function generate2(history: IMessage[]) {
    const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY
    });

    const stream = createStreamableValue('');

    const messages = [] as CoreMessage[]

    history.forEach(msg => {
        let role: 'assistant' | 'user' | 'tool' | 'system' = 'assistant'

        switch (msg.role) {
            case 'model':
                role = 'assistant'
                break;
            default:
                role = msg.role
        }

        messages.push(
            {
                role: role,
                content: [
                    {
                        type: 'text',
                        text: msg.parts[0].text
                    }
                ]

            } as CoreMessage
        )
    });

    (async () => {
        const { textStream } = streamText({
            model: google('gemini-1.5-flash'),
            messages: messages,
            onError: (error) => {
                console.log(error)
            }
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })();

    return { output: stream.value };
}