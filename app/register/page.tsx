"use client"
import { createUser } from "@/server-side/database-handler";
import { useActionState } from "react";
import { MdError } from "react-icons/md";


export default function Loading() {

  const [state, action, pending] = useActionState(createUser, undefined)

  return (
    <div className="flex flex-row justify-center self-center w-[50%] h-[90%] shadow-2xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] shadow-indigo-600/40 rounded-3xl p-2 gap-1 mt-12">

      <div className="flex flex-col  w-[60%] overflow-auto gap-5 overflow-hidden ">

        <div className="flex flex-row self-center p-5 pt-10 text-5xl font-semi-bold gap-3">
          Регистрация нового пользователя
        </div>

        {state?.type == 'error' && <p className=" flex flex-row gap-2 items-center text-center self-center w-10% text-md p-2 rounded-2xl border-2 border-red bg-[#ff8080]">
          <MdError />
          {state.msg}
        </p>}

        {state?.type == 'ok' && <p className=" flex flex-row gap-2 items-center text-center self-center w-10% text-md p-2 rounded-2xl border-2 border-red text-white bg-[#85e085]">
          <MdError />
          {state.msg}
          <a href="/" className="border-2 p-1 rounded-3xl">Войти</a>
        </p>}

        <form className="flex flex-col p-4 justify-center gap-2" action={action} >
          <p className="text-xl">Ваш логин</p>
          <input required name="login" className=" border-2 border-black dark:border-white rounded-3xl  text-md focus:outline-none select-none flex bg-transparent w-11/12 items-center  p-1 pl-4" placeholder="Login" type="text" />
          <p className="text-xl">Ваш пароль</p>
          <input required name="password" className=" border-2 border-black dark:border-white rounded-3xl  text-md focus:outline-none select-none flex bg-transparent w-11/12 items-center p-1 pl-4" placeholder="Password" type="text" />

          <input className=" p-2 mt-5 self-center rounded-3xl border-2 border-black dark:border-white w-[30%]" type="submit" value={'Регистрация'} />
          <a href="/" className="self-center text-xs">уже есть аккаунт? - нажмите сюда</a>
        </form>
      </div>
    </div>
  );
}

/*
      <div className="flex w-[30%] h-[30%] justify-center items-center hover:bg-sky-700 hover:rounded-xl hover:cursor-pointer">
        Войти
      </div>
      <div className="flex w-[30%] h-[30%] justify-center items-center hover:bg-sky-700 hover:rounded-xl hover:cursor-pointer">
        Регистрация
      </div>

      */