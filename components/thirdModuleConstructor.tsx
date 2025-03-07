

function FieldReqsCheck({ name, variable, predicate, ifNotMessage }: { name: string, variable: any, predicate: (value: any) => boolean, ifNotMessage: string }) {
    return (
        <div className="flex flex-row gap-2 text-center items-center w-[100%]">
            <div className="font-semibold">
                {`${name}:`}
            </div>
            {predicate(variable) &&
                <div className="flex flex-row gap-1 text-[#7242f5]  p-1 items-center text-center">{variable}</div>
            }
            {!predicate(variable) &&
                <div className="flex flex-row gap-1 rounded-xl border-2 border-[#c71436] text-[#c71436] bg-[#fbd9df] p-1 items-center text-center">{ifNotMessage}</div>
            }
        </div>
    )
}


export default function ({ inputs, outputs, name, description, endpoint, photo, }: {
    inputs: any[]
    outputs: any[]
    name: string
    description: string,
    endpoint: string,
    photo: string
}) {


    return (
        <div className="flex flex-row justify-center h-[100%] w-[70%] p-2 gap-4 ">
            <div className="flex flex-col w-1/2 h-full gap-2 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#ffffff] p-2">
                <div className="font-semibold">
                    Соответствие требованиям
                </div>
                <div className="flex flex-col gap-2">
                    <FieldReqsCheck name="Имя" variable={name} predicate={(value: string) => value.length > 5} ifNotMessage="имя должно содержать более 5 символов" />
                    <FieldReqsCheck name="URL" variable={endpoint} predicate={(value: string) => value.length > 0} ifNotMessage="укажите URL"  />
                    <FieldReqsCheck name="Фото" variable={photo} predicate={(value: string) => value.length > 0} ifNotMessage="загрузите Фото" />
                </div>
            </div>
        </div>
    )
}