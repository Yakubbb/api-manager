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

export default function Loading() {

  let userName = useSearchParams().get('name')

  const [state, action, pending] = useActionState(validateUserCreds, undefined)
  const [userLogin,setUserLogin] = useState('')

  return (
    <div className="flex flex-row items-center justify-center self-center w-[50%] h-[90%] shadow-2xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] shadow-indigo-600/40 rounded-3xl p- gap-1 overflow:hide mt-12 ">

      <div className="flex flex-col  w-[60%] overflow-auto gap-5">

        <div className="flex flex-row self-center p-5 pt-10 text-5xl font-semi-bold">
          Привет! {userLogin}
        </div>


        {state?.type == 'error' && <p className=" flex flex-row gap-2 items-center text-center self-center w-10% text-md p-2 rounded-2xl border-2 border-red bg-[#ff8080]">
          <MdError />
          {state.msg}
        </p>}

        <form className="flex flex-col p-4 justify-center gap-2" action={action} >
          <p className="text-xl">Ваш логин</p>
          <input required name="login" className=" border-2 border-black dark:border-white rounded-3xl  text-md focus:outline-none select-none flex bg-transparent w-11/12 items-center  p-1 pl-4" placeholder="Login" onChange={(event)=>setUserLogin(event.target.value)} type="text" />
          <p className="text-xl">Ваш пароль</p>
          <input hidden={true} required name="password" className=" border-2 border-black dark:border-white rounded-3xl  text-md focus:outline-none select-none flex bg-transparent w-11/12 items-center p-1 pl-4" placeholder="Password" type="text" />

          <input className=" p-2 mt-5 self-center rounded-3xl border-2 border-black dark:border-white w-[30%]" type="submit" value={'Войти'} />
        </form>

        <div className="flex flex-row p-4 justify-center gap-5" >
          <div className="flex flex-row  text-center text-xl gap-2 items-center justify-center   shadow-2xl shadow-indigo-600/20 hover:bg-sky-700 hover:rounded-2xl hover:cursor-pointer  ">
            <FcGoogle /> Google
          </div>
          <div className="flex flex-row  text-center text-xl gap-2 items-center justify-center  shadow-2xl shadow-indigo-600/20 hover:bg-sky-700 hover:rounded-2xl hover:cursor-pointer  ">
            <FaGithubAlt /> Github
          </div>
          <a href="/register" className="flex flex-row  text-center text-xl gap-2 items-center justify-center   shadow-2xl shadow-indigo-600/20 hover:bg-sky-700 hover:rounded-2xl hover:cursor-pointer ">
            <FaRegUser /> Register
          </a>
        </div>

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