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
    <div className="flex flex-col items-center justify-center self-center w-[90%] max-w-md h-fit p-8 shadow-xl rounded-2xl bg-white">

      <div className="flex flex-col w-full gap-6">

        <div className="text-3xl font-semibold text-center text-gray-800">
          Добро пожаловать!
        </div>

        {state?.type == 'error' && (
          <div className="flex flex-row gap-2 items-center text-sm text-red-600 bg-red-100 p-3 rounded-md">
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ваш пароль"
              type="password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Войти
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="text-center text-gray-600">Или войдите с помощью</div>
          <div className="flex justify-center gap-4">
            <button className="p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
              <FcGoogle size={28} />
            </button>
            <button className="p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
              <FaGithubAlt size={28} />
            </button>
          </div>
        </div>

        <div className="mt-6 text-sm text-center text-gray-500">
          Нет аккаунта?
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
            Зарегистрироваться
          </Link>
        </div>

      </div>
    </div>
  );
}