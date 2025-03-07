import { useState } from "react"


function FieldReqsCheck({ name, variable, checkIfOkFunc, ifNotMessage, ifOkMessage }: {
    name: string,
    variable: any,
    checkIfOkFunc: (value: any) => { status: boolean, errorMsgAdditionalInfo?: string },
    ifNotMessage: string,
    ifOkMessage?: string
}) {

    const checked = checkIfOkFunc(variable)


    return (
        <div className="flex flex-row gap-2 justify-between w-[100%]">
            <div className="font-semibold">
                {`${name}:`}
            </div>
            <div className="items-right">
                {checked.status &&
                    <div className="flex flex-row gap-1 rounded-xl border-2 border-[#009900] text-[#009900] bg-[#e6ffe6] p-1 items-center text-center ">{ifOkMessage || variable}</div>
                }
                {!checked.status &&
                    <div className="flex flex-row gap-1 rounded-xl border-2 border-[#c71436] text-[#c71436] bg-[#fbd9df] p-1 items-center text-center ">{checked.errorMsgAdditionalInfo || ifNotMessage}</div>
                }
            </div>
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

    const [testInputs, setTestInputs] = useState<any[]>(inputs.map(e => ({ name: e.name, valueName: e.valueName })))
    const [testResult, setTestResult] = useState<any>()
    const [testsPassed, setTestsPassed] = useState<boolean>(true)


    return (
        <div className="flex flex-row justify-center h-[100%] w-[100%] p-4 gap-4 ">
            <div className="flex flex-col w-[40%] h-full gap-2 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#ffffff] p-2">
                <div className="font-semibold p-4 rounded-xl bg-[#cccccc]">
                    Соответствие требованиям
                </div>
                <div className="flex flex-col gap-2 w-[100%] p-4">
                    <FieldReqsCheck name="Имя" variable={name} checkIfOkFunc={(value: string) => ({ status: value.length > 5 })} ifNotMessage="имя должно содержать более 5 символов" />
                    <FieldReqsCheck name="URL" variable={endpoint} checkIfOkFunc={(value: string) => ({ status: value.length > 0 })} ifNotMessage="укажите URL" />
                    <FieldReqsCheck name="Фото" variable={photo} checkIfOkFunc={(value: string) => ({ status: value.length > 0 })} ifNotMessage="загрузите Фото" ifOkMessage="фото загружено" />
                    <FieldReqsCheck name="Имена переменных запроса"
                        variable={inputs}
                        checkIfOkFunc={(value: { name: any, type: any }[]) => {

                            let isOk = true
                            let errorMsgAdditionalInfo = undefined

                            value.forEach(e => {
                                if (e.name.length < 2) {
                                    isOk = false
                                    errorMsgAdditionalInfo = `длинна имени "${e.name}" меньше 2х символов`
                                    return
                                }
                                if (value.filter(i => i.name == e.name).length > 1) {
                                    isOk = false
                                    errorMsgAdditionalInfo = `имя "${e.name}" повторяется`
                                    return
                                }
                            })
                            return ({ status: isOk, errorMsgAdditionalInfo: errorMsgAdditionalInfo })
                        }}
                        ifNotMessage="имена переменных запроса должны иметь минимум 2 символа и не должны повторяться"
                        ifOkMessage="требования соблюдены"
                    />
                    <FieldReqsCheck name="Имена переменных ответа"
                        variable={outputs}
                        checkIfOkFunc={(value: { name: any, type: any }[]) => {

                            let isOk = true
                            let errorMsgAdditionalInfo = undefined

                            if (value.length < 1) {
                                isOk = false
                                errorMsgAdditionalInfo = 'модуль должен содержать хотя бы одну переменную в ответе'
                            }
                            else {
                                value.forEach(e => {
                                    if (e.name.length < 2) {
                                        isOk = false
                                        errorMsgAdditionalInfo = `длинна имени "${e.name}" меньше 2х символов`
                                        return
                                    }
                                    if (value.filter(i => i.name == e.name).length > 1) {
                                        isOk = false
                                        errorMsgAdditionalInfo = `имя "${e.name}" повторяется`
                                        return
                                    }
                                })
                            }
                            return ({ status: isOk, errorMsgAdditionalInfo: errorMsgAdditionalInfo })
                        }}
                        ifNotMessage="имена переменных ответа должны иметь минимум 2 символа и не должны повторяться"
                        ifOkMessage="требования соблюдены"
                    />
                </div>
                <div className="font-semibold p-4 rounded-xl bg-[#cccccc]">
                    Соответствие схеме
                </div>
                <div className="flex flex-col gap-2 w-[100%] h-[100%] p-4">
                    {testResult ||
                        <div className="flex flex-row gap-1 rounded-xl border-2 border-[#c71436] text-[#c71436] bg-[#fbd9df] p-1 justify-center text-center items-center w-[100%] h-[100%] ">
                            Тестирование не произведено
                        </div>
                    }
                </div>

            </div>
            <div className="flex flex-col w-1/2 h-full gap-2 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#ffffff] p-2 w-[60%]">
                <div className="font-semibold">
                    Тестирование
                </div>
                <div className="flex flex-col gap-2 p-4 rounded-xl border-2 border-[#cccccc]">
                    {testInputs.map((inp, index) => {
                        return (
                            <div className="flex flex-row gap-2 p-2 rounded-md border-2" key={index}>
                                <div>
                                    {inp.name}
                                </div>
                                <div>
                                    {inp.valueName} =
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}