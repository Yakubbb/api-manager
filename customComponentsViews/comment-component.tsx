import { getUserIdFromSession } from "@/server-side/database-getter";
import { getUserDataForFront, getUserNameById } from "@/server-side/database-handler";
import { useEffect, useState } from "react";

export default function ({ userId, text, date, onDelete, authorID }:
    {
        userId: string,
        text: string,
        date: string,
        authorID: string
        onDelete: () => void,
    }) {

    const [name, setName] = useState<string>('...')
    const [isDelitable, setIsDelitable] = useState<boolean>(false)

    useEffect(() => {

        const fetchData = async () => {

            const data = await getUserNameById(userId)

            const currentUserId = (await getUserDataForFront()).id
            const currentUserRole = (await getUserDataForFront()).role

            const isCommentAuthor = currentUserId == userId
            const isAuthor = authorID == currentUserId
            const isAdmin = currentUserRole == 'admin' || currentUserRole == 'system'


            setIsDelitable(isCommentAuthor || isAuthor || isAdmin )
            setName(data)
        }
        fetchData()


    }, [userId])

    return (
        <div className="flex flex-row justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200">
            <div>
                <p className="text-sm text-gray-800">{text}</p>
                <p className="text-xs text-gray-500 mt-1">{`${name} | ${date}`}</p>
            </div>
            {isDelitable &&
                <button className="p-1 text-xs hover:text-red" onClick={() => onDelete()}>
                    удалить
                </button>
            }
        </div>
    )
}