import JsonInputsHandler from "./jsonInputsHandler"
import JsonInputsRenderer from "./jsonInputsRenderer"

export default function ({ inputs, setInputs, outputs, setOutputs, avalibleTypes }: {
    inputs: any[]
    outputs: any[]
    setInputs: (value: any) => void
    setOutputs: (value: any) => void
    avalibleTypes: any[]
}) {


    const handleAddingNewInput = (value: { name: string, type: string }) => {
        setInputs([...inputs, value])
    }

    const handleAddingNewOutput = (value: { name: string, type: string }) => {
        setOutputs([...outputs, value])
    }

    const handleDeleteingNewOutput = (value: number) => {
        setOutputs(outputs.filter((o, index) => index != value))
    }

    const handleDeleteingNewInput = (value: number) => {
        setInputs(inputs.filter((i, index) => index != value))
    }


    const handleInputNameChange = (newName: string, newindex: number, newType?: string) => {
        setInputs(inputs.map((inp, index) => {
            if (index == newindex) {
                return { name: newName, type: newType ? newType : inp.type }
            }
            else {
                return { name: inp.name, type: inp.type }
            }
        }))
    }

    const handleOutputNameChange = (newName: string, newindex: number, newType?: string) => {
        setOutputs(outputs.map((inp, index) => {
            if (index == newindex) {
                return { name: newName, type: newType ? newType : inp.type }
            }
            else {
                return { name: inp.name, type: inp.type }
            }
        }))
    }

    return (
        <div className="flex flex-col justify-center h-[100%] w-[70%] p-2 gap-4 ">
            <div className="w-full h-1/2 flex flex-row gap-2 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#ffffff] ">
                <JsonInputsHandler
                    name="переменные запроса"
                    valueName="переменная" inputs={inputs}
                    handleAddingNewInput={handleAddingNewInput}
                    handleInputNameChange={handleInputNameChange}
                    handleInputDeleting={handleDeleteingNewInput}
                    avalibleTypes={avalibleTypes}
                />

                <JsonInputsRenderer inputs={inputs} name="схема запроса" />
            </div>
            <div className="w-full h-1/2 flex flex-row gap-2 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#ffffff] ">
                <JsonInputsHandler
                    name="переменные ответа"
                    valueName="переменная"
                    inputs={outputs}
                    handleAddingNewInput={handleAddingNewOutput}
                    handleInputNameChange={handleOutputNameChange}
                    handleInputDeleting={handleDeleteingNewOutput}
                    avalibleTypes={avalibleTypes}
                />
                <JsonInputsRenderer inputs={outputs} name="схема ответа" />
            </div>
        </div>
    )
}