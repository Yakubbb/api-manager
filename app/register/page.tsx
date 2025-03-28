"use client"
import { createUser } from "@/server-side/database-handler";
import { useActionState } from "react";
import { MdError, MdCheckCircle } from "react-icons/md";
import Link from 'next/link';

export default function RegistrationPage() {

  const [state, action, pending] = useActionState(createUser, undefined)

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <div className="flex flex-col gap-6">

          <div className="text-center text-3xl font-semibold text-gray-800">
            Регистрация
          </div>

          {state?.type === 'error' && (
            <div className="flex flex-row items-center gap-2 rounded-md bg-red-100 p-3 text-sm text-red-600">
              <MdError />
              {state.msg}
            </div>
          )}

          {state?.type === 'ok' && (
            <div className="flex flex-col items-center gap-3 rounded-md bg-green-100 p-3 text-sm text-green-700">
              <div className="flex items-center gap-2">
                <MdCheckCircle />
                {state.msg}
              </div>
              <Link href="/" className="mt-2 inline-block rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">
                Войти в аккаунт
              </Link>
            </div>
          )}

          {state?.type !== 'ok' && (
            <form className="flex flex-col gap-4" action={action}>
              <div>
                <label htmlFor="login" className="block text-sm font-medium text-gray-700">Логин</label>
                <input
                  id="login"
                  name="login"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Придумайте логин"
                  type="text"
                  disabled={pending}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль</label>
                <input
                  id="password"
                  name="password"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Придумайте пароль"
                  type="password"
                  disabled={pending}
                />
              </div>
              <button
                type="submit"
                disabled={pending}
                className={`mt-2 w-full flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {pending ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </form>
          )}

          {state?.type !== 'ok' && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Уже есть аккаунт?
              <Link href="/" className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
                Войти
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}