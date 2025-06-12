'use server'

import { ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';
import { getUserIdFromSession } from './database-getter';
import { createEmailSession, createSession, validateCookie } from './database-handler';

export async function checkIfEmail(email: string) {

}


export async function verifyEmail(code: string) {
    const isOk = await validateCookie(code)
    return isOk
}

export async function sendLetter(adress: string) {
    const userId = await getUserIdFromSession()

    const sessionCode = await createEmailSession(userId)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GOOGLE_MAIL_USER,
            pass: process.env.GOOGLE_MAIL_PASSWORD,
        },
    });

    const mailOptions: SendMailOptions = {
        from: {
            name: 'api-manager',
            address: process.env.GOOGLE_MAIL_USER!,
        },
        to: adress,
        subject: 'Ваш код подтверждения',
        text: `Ваш код подтверждения: ${sessionCode}`,
        html: `
            <p>Здравствуйте!</p>
            <p>Вот ваш код подтверждения:</p>
            <h2 style="color: #333; background-color: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block;">${sessionCode}</h2>
            <p>Пожалуйста, используйте этот код для подтверждения вашей учетной записи.</p>
        `,
    };

    const sendMail = async (options: SendMailOptions) => {
        try {
            await transporter.sendMail(options);
            console.log('Письмо успешно отправлено!');
        } catch (error) {
            console.error('Ошибка при отправке письма:', error);
        }
    };

    sendMail(mailOptions);
    return sessionCode
}