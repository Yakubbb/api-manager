"use client"
import { GiSandsOfTime } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaGithubAlt } from "react-icons/fa";
import { FcGoodDecision } from "react-icons/fc";
import { validateUserCreds } from "@/server-side/database-handler";
import { useActionState, useState } from "react";
import { MdError } from "react-icons/md";
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function () {

  let userName = useSearchParams().get('name')

  const [state, action, pending] = useActionState(validateUserCreds, undefined)
  const [userLogin, setUserLogin] = useState('')

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <div className="flex flex-col gap-6">

          <div className="text-center text-3xl font-semibold text-gray-800">
            Добро пожаловать!
          </div>

          {state?.type == 'error' && (
            <div className="flex flex-row items-center gap-2 rounded-md bg-red-100 p-3 text-sm text-red-600">
              <MdError />
              {state.msg}
            </div>
          )}

          <form className="flex flex-col gap-4" action={action}>
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700">Логин</label>
              <input
                id="login"
                name="login"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Ваш логин"
                onChange={(event) => setUserLogin(event.target.value)}
                type="text"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль</label>
              <input
                id="password"
                name="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Ваш пароль"
                type="password"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className={`w-full flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {pending ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Нет аккаунта?
            <Link href="/register" className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
              Зарегистрироваться
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}