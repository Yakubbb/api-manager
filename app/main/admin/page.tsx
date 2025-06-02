'use client'
import { getAllUsersForFront, getUserDataForFront } from "@/server-side/database-handler";
import { useEffect, useState } from "react";

export default function AdminPanel() {

    const [access, setAccess] = useState<'admin' | 'system' | null>(null);
    const [users, setUsers] = useState<{ role: string, name: string, email: string, image: string, id: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAsync = async () => {
            try {
                const userData = await getUserDataForFront();
                const role = userData.role;

                switch (role) {
                    case 'admin':
                        setAccess('admin');
                        break;
                    case 'system':
                        setAccess('system');
                        break;
                    default:
                        setAccess(null);
                        break;
                }

                const allUsers = await getAllUsersForFront();
                setUsers(allUsers);

            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            } finally {
                setLoading(false);
            }

        }

        fetchAsync()
    }, [])

    const handleDeleteUser = (userId: string, userRole: string) => {
        if (!access) {
            console.warn("Нет прав для удаления пользователей.");
            return;
        }

        if (access === 'system' && (userRole === 'system')) {
            console.warn("System не может удалять других system пользователей.");
            return;
        }

        if (access === 'admin' && (userRole === 'admin' || userRole === 'system')) {
            console.warn("Администратор не может удалять других администраторов или system пользователей.");
            return;
        }

        console.log(`Удаление пользователя с ID: ${userId} и ролью: ${userRole}`);

        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    };


    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!access) {
        return <div>Нет доступа</div>;
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Панель Администратора</h1>
            <p>Вы вошли как: {access}</p>

            {users.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b"></th>
                                <th className="py-2 px-4 border-b">Имя</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Роль</th>
                                <th className="py-2 px-4 border-b">Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">
                                        <div className="w-8 h-8 rounded-full overflow-hidden">
                                            <img src={user.image} alt={`Avatar of ${user.name}`} className="object-cover w-full h-full" />
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b">{user.name}</td>
                                    <td className="py-2 px-4 border-b">{user.email}</td>
                                    <td className="py-2 px-4 border-b">{user.role}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleDeleteUser(user.id, user.role)}
                                            disabled={
                                                (access === 'system' && user.role === 'system') ||
                                                (access === 'admin' && (user.role === 'admin' || user.role === 'system'))
                                            }
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>Пользователи не найдены.</div>
            )}
        </div>
    );
}