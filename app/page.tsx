import { GiSandsOfTime } from "react-icons/gi";

export default function Loading() {
  return (
    <section className="flex flex-row justify-between gap-10 self-center bg-slate-900 w-[60%] h-[80%]">
      <div className="flex w-[30%] justify-center items-center hover:bg-sky-700 hover:rounded-xl hover:cursor-pointer">
        Войти
      </div>
      <div className="flex w-[30%] justify-center items-center hover:bg-sky-700 hover:rounded-xl hover:cursor-pointer">
        Регистрация
      </div>
    </section>
  );
}
