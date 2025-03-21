
function CustomVariant({ name, description, color }: { name: string, description: string, color: string }) {
    return (
        <div className={`flex flex-col gap-2 rounded-2xl p-4 text-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]`} style={{ backgroundColor: `${color}` }}>
            <div className="flex flex-row gap-1 font-bold text-xl">
                {name}
            </div>
            <div className="flex flex-row gap-1 font-main2">
                {description}
            </div>
        </div>
    )
}

export default function () {
    return (
        <div className="flex flex-row w-full h-full gap-2 p-4">
            <div className="flex flex-col gap-2 rounded-xl w-[40%] h-[100%] bg-[#ffffff] p-4 shadow-[0_3px_10px_rgb(0,0,0,0.1)]">
                <div className="flex flex-row rounded-xl bg-[#cccccc] w-[100%] h-[10%] font-semibold p-4 text-xl items-center">
                    Доступные варианты кастомизации
                </div>
                <div className="flex flex-col rounded-xl w-[100%] h-[90%] p-2 gap-2">
                    <CustomVariant name="Системный промпт" description="системный промпт - это промпт, от системы" color={'#47baac'} />
                    <CustomVariant name="История чата" description="вы можете подставить свою историю чата, чтобы предоставить модели пример как нужно отвечать" color={'#ff96e0'} />
                    <CustomVariant name="Промпт" description="ваш запрос модели" color={'#a7b1ff'} />
                </div>
            </div>
            <div className="rounded-md border bg-[#cccccc] w-[60%]">
                aboba
            </div>
        </div>
    )
}