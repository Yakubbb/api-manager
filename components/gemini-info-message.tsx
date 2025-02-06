import Link from "next/link";
import { IconType } from "react-icons";
import { MdOutlineArrowOutward } from "react-icons/md";


export default function ({
    name,
    description,
    href,
    Icon
}: {
    name: string,
    description: string,
    href: string,
    Icon: IconType
}) {
    return (

        <div className="flex flex-col rounded-2xl p-3 bg-[#E0E0E0] h-[100%] w-[40%] justify-between">
            <div className="flex flex-row gap-2 text-xl font-semibold items-center text-center">
                <Icon />
                {name}
            </div>
            <p>{description}</p>

            <Link className="flex flex-row gap-1 items-center mt-10 text-center text-md" href={href}>
                Перейти
                <MdOutlineArrowOutward />
            </Link>
        </div>
    )
}