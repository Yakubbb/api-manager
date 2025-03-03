import { IoMdAddCircle } from "react-icons/io"

export default function ({ name, inputs, handleAddingNewInput, handleInputNameChange, valueName }: {
    name: string,
    valueName: string,
    inputs: any[],
    handleAddingNewInput: (value: any) => void,
    handleInputNameChange: (name: string, number: number) => void
}) {
    return (
        <div className="flex flex-col gap-2 rounded-xl w-[100%] h-[100%] p-4 ">
            <div className="flex flex-row gap-1 text-xl font-semibold">
                {name}
                <div className="text-[#7242f5] hover:cursor-pointer">
                    <IoMdAddCircle className="self-center" size={30} onClick={
                        () => handleAddingNewInput({ name: `${valueName} ${inputs.length}`, type: 'text' })
                    } />
                </div>
            </div>
            <div className="flex flex-col gap-2 w-[100%] rounded-xl grow p-4 overflow-auto border-2 border-[#9ca3af] rounded-xl">
                {inputs.map((e, idex) => {
                    return (
                        <div className="flex flex-row gap-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl p-2" key={idex}>
                            <input className="w-20" type="text" defaultValue={e.name} onChange={(event) => handleInputNameChange(event.target.value, idex)} />
                            <div>{e.type}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
