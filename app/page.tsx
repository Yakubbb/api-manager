import { GiSandsOfTime } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaGithubAlt } from "react-icons/fa";
import { FcGoodDecision } from "react-icons/fc";

export default function Loading() {
  return (
    <div className="flex flex-row justify-center self-center w-[50%] h-[80%] shadow-2xl shadow-indigo-600/20  rounded-3xl p-2 gap-1">

      <div className="flex flex-col  w-[60%] overflow-auto gap-5">

        <div className="flex flex-row self-center p-5 pt-10 text-5xl font-semi-bold">
          <FaRegUser />
        </div>

        <div className="flex flex-col p-4 justify-center gap-2" >
          <p className="text-xl">Ваш логин</p>
          <input className=" border-2 border-black dark:border-white rounded-3xl  text-md focus:outline-none select-none flex bg-transparent w-11/12 items-center  p-1 pl-4" placeholder="Login" type="text" />
          <p className="text-xl">Ваш пароль</p>
          <input className=" border-2 border-black dark:border-white rounded-3xl  text-md focus:outline-none select-none flex bg-transparent w-11/12 items-center p-1 pl-4" placeholder="Password" type="text" />
        </div>

        <div className="flex flex-row p-4 justify-center gap-5" >
          <div className="flex flex-row  text-center text-xl gap-2 items-center justify-center   shadow-2xl shadow-indigo-600/20 hover:bg-sky-700 hover:rounded-2xl hover:cursor-pointer  ">
            <FcGoogle /> Google
          </div>
          <div className="flex flex-row  text-center text-xl gap-2 items-center justify-center  shadow-2xl shadow-indigo-600/20 hover:bg-sky-700 hover:rounded-2xl hover:cursor-pointer  ">
            <FaGithubAlt /> Github
          </div>
          <div className="flex flex-row  text-center text-xl gap-2 items-center justify-center   shadow-2xl shadow-indigo-600/20 hover:bg-sky-700 hover:rounded-2xl hover:cursor-pointer ">
            <FaRegUser /> Register
          </div>
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