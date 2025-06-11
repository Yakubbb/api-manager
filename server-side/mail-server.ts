'use server'

import nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';

export async function sendLetter(adress: string, code: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GOOGLE_MAIL_USER,
            pass: process.env.GOOGLE_MAIL_PASSWORD,
        },
    });

    const mailOptions: SendMailOptions = {
        from: {
            name: 'AAAAAAAAAAAAA',
            address: process.env.GOOGLE_MAIL_USER!,
        },
        to: adress,
        subject: 'Ваш код подтверждения',
        text: `Ваш код подтверждения: ${code}`,
        html: `
            <p>Здравствуйте!</p>
            <p>Вот ваш код подтверждения:</p>
            <h2 style="color: #333; background-color: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block;">${code}</h2>
            <p>Пожалуйста, используйте этот код для подтверждения вашей учетной записи.</p>
            <p>С уважением,</p>
            <p>Ваша команда</p>
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
}