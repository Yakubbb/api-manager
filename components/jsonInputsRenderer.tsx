export default function ({ inputs, name }: { inputs: any[], name: string }) {
    return (
        <div className="flex flex-col gap-2 rounded-xl w-[100%] h-[100%] p-4 ">
            <div className="text-xl font-semibold">
                {name}
            </div>
            <div className="flex flex-col gap-1 rounded-xl grow p-4 overflow-auto border-2 border-[#9ca3af] rounded-xl">
                <div> {'{'} </div>
                {inputs.map((inp, index) => {
                    return <div className="flex flex-row gap-1" key={index}>
                        <div>"</div>
                        <div>{inp.name}</div>
                        <div>"</div>
                        <div>:</div>
                        <div>"</div>
                        <div>any</div>
                        <div className="text-[#7242f5]">{inp.type}</div>
                        <div>value</div>
                        <div>"</div>
                        <div>,</div>
                    </div>
                })}
                <div> {'}'} </div>
            </div>
        </div>
    )
}