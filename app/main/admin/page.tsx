'use client'
import { deleteUser, getAllUsersForFront, getUserDataForFront } from "@/server-side/database-handler";
import { useEffect, useState, useCallback, useMemo } from "react";
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { createPortal } from 'react-dom'; // Для рендеринга модального окна вне основного DOM

type SortableKeys = 'name' | 'email' | 'role';

interface SortConfig {
    key: SortableKeys;
    order: 'asc' | 'desc';
}

interface User {
    role: string;
    name: string;
    email: string;
    image: string;
    id: string;
}

// Компонент модального окна подтверждения
interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, userName }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-auto">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Подтвердите удаление</h3>
                <p className="text-gray-700 mb-6">
                    Вы уверены, что хотите удалить пользователя <span className="font-semibold">{userName}</span>? Это действие необратимо.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>,
        document.body // Рендерим модальное окно в body
    );
};

export default function AdminPanel() {

    const [access, setAccess] = useState<'admin' | 'system' | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', order: 'asc' });

    // Состояния для модального окна подтверждения
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Состояния для сообщений об удалении
    const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
    const [deleteMessageType, setDeleteMessageType] = useState<'success' | 'error' | null>(null);

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
                setAccess(null); // Устанавливаем доступ в null при ошибке
            } finally {
                setLoading(false);
            }

        }

        fetchAsync()
    }, [])

    const openDeleteConfirmDialog = useCallback((user: User) => {
        if (!access) {
            setDeleteMessage("У вас нет прав для выполнения этой операции.");
            setDeleteMessageType('error');
            return;
        }

        if (access === 'system' && (user.role === 'system')) {
            setDeleteMessage("System не может удалять других system пользователей.");
            setDeleteMessageType('error');
            return;
        }

        if (access === 'admin' && (user.role === 'admin' || user.role === 'system')) {
            setDeleteMessage("Администратор не может удалять других администраторов или system пользователей.");
            setDeleteMessageType('error');
            return;
        }

        setUserToDelete(user);
        setShowConfirmDialog(true);
        // Скрываем сообщение, если оно было
        setDeleteMessage(null);
        setDeleteMessageType(null);
    }, [access]);

    const closeDeleteConfirmDialog = useCallback(() => {
        setShowConfirmDialog(false);
        setUserToDelete(null);
    }, []);

    const confirmDeleteUser = useCallback(async () => {
        if (!userToDelete) return;

        closeDeleteConfirmDialog(); 

        try {
            const success = await deleteUser(userToDelete.id)
            if (success) {
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
                setDeleteMessage(`Пользователь "${userToDelete.name}" успешно удален.`);
                setDeleteMessageType('success');
            } else {
                // Если `deleteUser` вернет `{ success: false, message: "..." }`
                setDeleteMessage(`Ошибка при удалении пользователя "${userToDelete.name}".`); // ${result.message}
                setDeleteMessageType('error');
            }
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            setDeleteMessage(`Произошла ошибка при удалении пользователя "${userToDelete.name}".`);
            setDeleteMessageType('error');
        } finally {
            setLoading(false);
            setUserToDelete(null); // Сбрасываем пользователя для удаления
            // Скрываем сообщение через несколько секунд
            setTimeout(() => {
                setDeleteMessage(null);
                setDeleteMessageType(null);
            }, 5000);
        }
    }, [userToDelete, closeDeleteConfirmDialog]);


    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, []);

    const handleSort = useCallback((key: SortableKeys) => {
        setSortConfig(current => ({
            key,
            order: current.key === key && current.order === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    const displayedUsers = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = users.filter(user => {
            return !searchTerm ||
                user.name.toLowerCase().includes(lowerSearch) ||
                user.email.toLowerCase().includes(lowerSearch) ||
                user.role.toLowerCase().includes(lowerSearch);
        });

        return [...filtered].sort((a, b) => {
            const { key, order } = sortConfig;
            let valA: string;
            let valB: string;

            switch (key) {
                case 'name':
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
                    break;
                case 'email':
                    valA = a.email.toLowerCase();
                    valB = b.email.toLowerCase();
                    break;
                case 'role':
                    valA = a.role.toLowerCase();
                    valB = b.role.toLowerCase();
                    break;
                default:
                    return 0;
            }

            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }, [users, searchTerm, sortConfig]);

    const getSortIcon = (key: SortableKeys) => {
        if (sortConfig.key !== key) return <FaSort className="opacity-40" />;
        return sortConfig.order === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    const getRoleClasses = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-50 text-[#7242f5]';
            case 'system':
                return 'bg-red-50 text-red-700';
            case 'user':
                return 'bg-blue-50 text-blue-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    const getMessageClasses = (type: 'success' | 'error' | null) => {
        if (!type) return '';
        return type === 'success'
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700';
    };


    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl">Загрузка...</div>;
    }

    if (!access) {
        return <div className="flex justify-center items-center h-screen text-xl text-red-600">Нет доступа</div>;
    }

    const gridColsClasses = "grid grid-cols-[50px_1fr_1.5fr_120px_120px]";
    const minWidthForGrid = "min-w-[700px]";

    return (
        <div className="h-full w-full flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Панель Администратора</h1>
            <p>Вы вошли как: <span className="font-semibold capitalize">{access}</span></p>

            <input
                type="text"
                placeholder="Искать пользователей..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-full border border-gray-300 px-5 py-2.5 shadow-sm focus:border-[#7242f5] focus:outline-none focus:ring-2 focus:ring-[#7242f5]/50 mb-4"
            />

            {deleteMessage && (
                <div
                    className={`p-3 rounded-md flex items-center justify-between text-sm ${getMessageClasses(deleteMessageType)}`}
                    role="alert"
                >
                    <span>{deleteMessage}</span>
                    <button
                        onClick={() => setDeleteMessage(null)}
                        className="ml-4 text-current hover:opacity-75 focus:outline-none"
                    >
                        ×
                    </button>
                </div>
            )}

            {displayedUsers.length > 0 ? (
                <div className="overflow-auto border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-white">
                        <div className={`bg-gray-100 ${gridColsClasses} ${minWidthForGrid} py-3 px-4 border-b border-gray-200 text-sm font-medium text-gray-600`}>
                            <div className="text-left"></div>
                            <div
                                className="flex items-center gap-1 text-left cursor-pointer select-none"
                                onClick={() => handleSort('name')}
                            >
                                Имя {getSortIcon('name')}
                            </div>
                            <div
                                className="flex items-center gap-1 text-left cursor-pointer select-none"
                                onClick={() => handleSort('email')}
                            >
                                Email {getSortIcon('email')}
                            </div>
                            <div
                                className="flex items-center justify-center gap-1 text-center cursor-pointer select-none font-main2"
                                onClick={() => handleSort('role')}
                            >
                                Роль {getSortIcon('role')}
                            </div>
                            <div className="text-center">Действие</div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {displayedUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className={`${gridColsClasses} ${minWidthForGrid} py-3 px-4 hover:bg-gray-50 transition-colors duration-150`}
                                >
                                    <div className="flex items-center">
                                        <div className="w-9 h-9 rounded-full overflow-hidden">
                                            <img src={user.image} alt={`Avatar of ${user.name}`} className="object-cover w-full h-full" />
                                        </div>
                                    </div>
                                    <div className="text-left text-sm text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {user.name}
                                    </div>
                                    <div className="text-left text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {user.email}
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 rounded-full capitalize ${getRoleClasses(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 rounded-md shadow-sm transition-colors duration-200
                                                       disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                                            onClick={() => openDeleteConfirmDialog(user)}
                                            disabled={
                                                (access === 'system' && user.role === 'system') ||
                                                (access === 'admin' && (user.role === 'admin' || user.role === 'system'))
                                            }
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-4 text-gray-600">Пользователи не найдены.</div>
            )}

            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={closeDeleteConfirmDialog}
                onConfirm={confirmDeleteUser}
                userName={userToDelete?.name || ''}
            />
        </div>
    );
}