"use client"
import { GiSandsOfTime } from "react-icons/gi";
import { FaCheckCircle, FaRegUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaGithubAlt } from "react-icons/fa";
import { validateUserCreds } from "@/server-side/database-handler";
import { useActionState, useState } from "react";
import { MdError } from "react-icons/md";
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FaEnvelope } from "react-icons/fa";
import { ifEmailClaimed, sendNewPasswordLetter } from "@/server-side/mail-server";

export default function LoginPage() {

  const userNameFromParams = useSearchParams().get('name');

  const [state, action, pending] = useActionState(validateUserCreds, undefined);
  const [userLogin, setUserLogin] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);

  const functionalColor = '#7242f5';

  const handleForgotPasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setForgotPasswordMessage('');
    setForgotPasswordError('');
    setIsSendingPasswordReset(true);

    if (!forgotPasswordEmail) {
      setForgotPasswordError('Пожалуйста, введите ваш email.');
      setIsSendingPasswordReset(false);
      return;
    }

    if (! (await ifEmailClaimed(forgotPasswordEmail))) {
      setForgotPasswordError('Пользователя с таким email нет');
      setIsSendingPasswordReset(false);
      return;
    }

    await sendNewPasswordLetter(forgotPasswordEmail)
    setForgotPasswordMessage(`Ссылка для сброса пароля отправлена на ${forgotPasswordEmail}. Проверьте вашу почту.`);
    setIsSendingPasswordReset(false);
    setForgotPasswordEmail('');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 font-sans">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl">

        <div className="flex flex-col gap-8">

          <div className="text-center text-4xl font-extrabold text-gray-800 font-main2">
            {showForgotPassword ? 'Сброс пароля' : 'Добро пожаловать!'}
          </div>

          {state?.type === 'error' && (
            <div className="flex flex-row items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 animate-fadeIn">
              <MdError className="text-xl" />
              {state.msg}
            </div>
          )}

          {forgotPasswordError && (
            <div className="flex flex-row items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 animate-fadeIn">
              <MdError className="text-xl" />
              {forgotPasswordError}
            </div>
          )}

          {forgotPasswordMessage && (
            <div className="flex flex-row items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200 animate-fadeIn">
              <FaCheckCircle className="text-xl text-green-500" />
              {forgotPasswordMessage}
            </div>
          )}

          {!showForgotPassword ? (
            <>
              <form className="flex flex-col gap-5" action={action}>
                <div>
                  <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">Логин</label>
                  <div className="relative">
                    <FaRegUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="login"
                      name="login"
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 shadow-sm focus:border-[#7242f5] focus:outline-none focus:ring-1 focus:ring-[#7242f5] text-base transition-colors duration-200"
                      placeholder="Ваш логин"
                      onChange={(event) => setUserLogin(event.target.value)}
                      type="text"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <input
                      id="password"
                      name="password"
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 shadow-sm focus:border-[#7242f5] focus:outline-none focus:ring-1 focus:ring-[#7242f5] text-base transition-colors duration-200"
                      placeholder="Ваш пароль"
                      type="password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  style={{ backgroundColor: functionalColor }}
                  className={`w-full flex justify-center items-center gap-2 rounded-lg border border-transparent px-4 py-3 text-lg font-medium text-white shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#7242f5] focus:ring-offset-2 transition-all duration-300 ${pending ? 'opacity-60 cursor-not-allowed' : 'transform hover:-translate-y-0.5'}`}
                >
                  {pending ? (
                    <>
                      <GiSandsOfTime className="animate-spin" /> Вход...
                    </>
                  ) : (
                    'Войти'
                  )}
                </button>
              </form>

              <div className="text-center text-sm">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="font-medium text-[#7242f5] hover:text-[#5a2ed1] transition-colors duration-200"
                >
                  Забыли пароль?
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative bg-white px-4 text-sm text-gray-500">
                  или
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
                >
                  <FcGoogle className="text-xl" /> Войти через Google
                </button>
                <button
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
                >
                  <FaGithubAlt className="text-xl" /> Войти через GitHub
                </button>
              </div>

              <div className="mt-4 text-center text-sm text-gray-600">
                Нет аккаунта?
                <Link href="/register" className="ml-1 font-medium text-[#7242f5] hover:text-[#5a2ed1] transition-colors duration-200">
                  Зарегистрироваться
                </Link>
              </div>
            </>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleForgotPasswordSubmit}>
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">Ваш Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 shadow-sm focus:border-[#7242f5] focus:outline-none focus:ring-1 focus:ring-[#7242f5] text-base transition-colors duration-200"
                    placeholder="example@email.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    disabled={isSendingPasswordReset}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSendingPasswordReset}
                style={{ backgroundColor: functionalColor }}
                className={`w-full flex justify-center items-center gap-2 rounded-lg border border-transparent px-4 py-3 text-lg font-medium text-white shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#7242f5] focus:ring-offset-2 transition-all duration-300 ${isSendingPasswordReset ? 'opacity-60 cursor-not-allowed' : 'transform hover:-translate-y-0.5'}`}
              >
                {isSendingPasswordReset ? (
                  <>
                    <GiSandsOfTime className="animate-spin" /> Отправка...
                  </>
                ) : (
                  'Сбросить пароль'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordError('');
                  setForgotPasswordMessage('');
                  setForgotPasswordEmail('');
                }}
                className="mt-4 text-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Вернуться к входу
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}