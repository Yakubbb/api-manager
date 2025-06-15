"use client"
import { createUser } from "@/server-side/database-handler";
import { useActionState } from "react";
import { MdError, MdCheckCircle } from "react-icons/md";
import Link from 'next/link';
import { FaRegUser, FaLock } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";

export default function RegistrationPage() {

  const [state, action, pending] = useActionState(createUser, undefined);
  const functionalColor = '#7242f5';

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 font-sans">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl">

        <div className="flex flex-col gap-8">

          <div className="text-center text-4xl font-extrabold text-gray-800 font-main2">
            Регистрация
          </div>

          {state?.type === 'error' && (
            <div className="flex flex-row items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 animate-fadeIn">
              <MdError className="text-xl" />
              {state.msg}
            </div>
          )}

          {state?.type === 'ok' && (
            <div className="flex flex-col items-center gap-3 rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200 animate-fadeIn">
              <div className="flex items-center gap-2 text-base font-medium">
                <MdCheckCircle className="text-xl text-green-500" />
                {state.msg}
              </div>
              <Link href="/" className="mt-2 inline-block rounded-lg bg-[#7242f5] px-6 py-2 text-base font-medium text-white shadow-md hover:bg-opacity-90 transition-all duration-200 transform hover:-translate-y-0.5">
                Войти в аккаунт
              </Link>
            </div>
          )}

          {state?.type !== 'ok' && (
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
                    placeholder="Придумайте логин"
                    type="text"
                    disabled={pending}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 shadow-sm focus:border-[#7242f5] focus:outline-none focus:ring-1 focus:ring-[#7242f5] text-base transition-colors duration-200"
                    placeholder="Придумайте пароль"
                    type="password"
                    disabled={pending}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={pending}
                style={{ backgroundColor: functionalColor }}
                className={`mt-2 w-full flex justify-center items-center gap-2 rounded-lg border border-transparent px-4 py-3 text-lg font-medium text-white shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#7242f5] focus:ring-offset-2 transition-all duration-300 ${pending ? 'opacity-60 cursor-not-allowed' : 'transform hover:-translate-y-0.5'}`}
              >
                {pending ? (
                  <>
                    <GiSandsOfTime className="animate-spin" /> Регистрация...
                  </>
                ) : (
                  'Зарегистрироваться'
                )}
              </button>
            </form>
          )}

          {state?.type !== 'ok' && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Уже есть аккаунт?
              <Link href="/" className="ml-1 font-medium text-[#7242f5] hover:text-[#5a2ed1] transition-colors duration-200">
                Войти
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}