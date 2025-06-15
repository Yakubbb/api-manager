'use server'

import { ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';
import { getUserIdFromSession } from './database-getter';
import { createEmailSession, createSession, getAllEmails, validateCookie } from './database-handler';

const sessionDuration = 5 * 60 * 1000; // 5 минут в миллисекундах

export async function ifEmailClaimed(email: string) {
    const emails = await getAllEmails()
    return emails.find(e => e.email == email) != undefined
}

export async function getUserIdByEmail(email: string) {
    const emails = await getAllEmails()
    return emails.find(e => e.email == email)?.userId
}


export async function verifyEmail(code: string) {
    const isOk = await validateCookie(code)
    return isOk
}

export async function sendNewPasswordLetter(adress: string) {
    const userId = await getUserIdByEmail(adress)

    const sessionCode = await createEmailSession(userId!)

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
        subject: 'Сброс пароля',
        text: `ссылка для сброса пароля: http://localhost:3000/drop/${sessionCode}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .code-box { background-color: #f0f0f0; padding: 15px; border-radius: 5px; display: inline-block; font-size: 24px; font-weight: bold; color: #333; margin: 15px 0; }
                    .link-text { font-size: 1.1em; margin-bottom: 15px; }
                    .link { color: #7242f5; text-decoration: none; font-weight: bold; }
                    .footer { margin-top: 20px; font-size: 0.9em; color: #777; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Сброс пароля</h2>
                    </div>
                    <p>Здравствуйте!</p>
                    <p>Вы запросили сброс пароля для вашей учетной записи.</p>
                    <p class="link-text">Для сброса пароля перейдите по следующей ссылке:</p>
                    <p><a href="http://localhost:3000/drop/${sessionCode}" class="link">http://localhost:3000/drop/${sessionCode}</a></p>
                    <p>Эта ссылка действительна в течение 5 минут.</p>
                    <div class="footer">
                        <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
                    </div>
                </div>
            </body>
            </html>
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
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .code-box { background-color: #f0f0f0; padding: 15px; border-radius: 5px; display: inline-block; font-size: 24px; font-weight: bold; color: #333; margin: 15px 0; }
                    .footer { margin-top: 20px; font-size: 0.9em; color: #777; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Код подтверждения</h2>
                    </div>
                    <p>Здравствуйте!</p>
                    <p>Вот ваш код подтверждения для входа:</p>
                    <div class="code-box">${sessionCode}</div>
                    <p>Этот код действителен в течение 5 минут.</p>
                    <div class="footer">
                        <p>Если вы не запрашивали этот код, проигнорируйте это письмо.</p>
                    </div>
                </div>
            </body>
            </html>
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