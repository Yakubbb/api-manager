'use server'
import * as googleTTS from 'google-tts-api';

export async function getGooleVoice64(text: string, lang: string) {
    const data = await googleTTS.getAudioBase64(text, {
        lang: lang,
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000,
    })
    return data
}