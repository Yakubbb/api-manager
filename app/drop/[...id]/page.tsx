'use client'
import { getUserFromSession, getUserIdFromSessionById, updateUserPassword as updateUserPasswordServerAction } from "@/server-side/database-handler";
import { useEffect, useState } from "react";
import { GiSandsOfTime } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { FaLock } from "react-icons/fa";

export default function CustomItemPage({ params }: { params: Promise<{ id: string[] }> }) {
    const [userId, setUserId] = useState<string | undefined>();
    const [isLoadingUserId, setIsLoadingUserId] = useState(true);
    const [loadUserError, setLoadUserError] = useState<string | null>(null);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [updateMessage, setUpdateMessage] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const functionalColor = '#7242f5';

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingUserId(true);
            setLoadUserError(null);
            setUserId(undefined);

            try {
                const resolvedParams = await params;
                const sessionIdFromParams = resolvedParams?.id?.[0];

                if (!sessionIdFromParams) {
                    setLoadUserError("ID сессии пользователя не предоставлен в URL.");
                    return;
                }

                const sessionUserId = await getUserIdFromSessionById(sessionIdFromParams);

                if (sessionUserId) {
                    setUserId(sessionUserId);
                } else {
                    setLoadUserError("Пользователь не найден или сессия недействительна.");
                }
            } catch (error) {
                setLoadUserError("Произошла ошибка при загрузке данных пользователя.");
            } finally {
                setIsLoadingUserId(false);
            }
        };
        fetchData();
    }, [params]);

    const handleUpdatePassword = async (event: React.FormEvent) => {
        event.preventDefault();

        setUpdateMessage(null);
        setUpdateError(null);

        if (!newPassword || !confirmPassword) {
            setUpdateError("Пожалуйста, введите новый пароль и его подтверждение.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setUpdateError("Пароли не совпадают.");
            return;
        }

        if (!userId) {
             setUpdateError("Не удалось обновить пароль: ID пользователя недоступен.");
             return;
        }

        setIsUpdatingPassword(true);

        try {
            const result = await updateUserPasswordServerAction(userId, newPassword);

            if (result.success) {
                setUpdateMessage(result.message);
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setUpdateError(result.message);
            }
        } catch (error) {
            setUpdateError("Произошла ошибка при обновлении пароля.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 font-sans">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl">
                <div className="flex flex-col gap-8">

                    <div className="text-center text-4xl font-extrabold text-gray-800 font-main2">
                        Настройки аккаунта
                    </div>

                    {isLoadingUserId && (
                         <div className="flex flex-row items-center gap-2 rounded-lg bg-blue-50 p-4 text-sm text-blue-700 border border-blue-200 animate-fadeIn">
                            <GiSandsOfTime className="animate-spin" /> Загрузка данных пользователя...
                         </div>
                    )}

                     {loadUserError && (
                        <div className="flex flex-row items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 animate-fadeIn">
                            <MdError className="text-xl" />
                            {loadUserError}
                        </div>
                    )}

                    {updateError && (
                        <div className="flex flex-row items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 animate-fadeIn">
                            <MdError className="text-xl" />
                            {updateError}
                        </div>
                    )}

                    {updateMessage && (
                        <div className="flex flex-row items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200 animate-fadeIn">
                            <FaCheckCircle className="text-xl text-green-500" />
                            {updateMessage}
                        </div>
                    )}

                    {userId && !isLoadingUserId && !loadUserError && (
                        <form className="flex flex-col gap-5" onSubmit={handleUpdatePassword}>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">Новый пароль</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="newPassword"
                                        type="password"
                                        required
                                        className="mt-1 block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 shadow-sm focus:border-[#7242f5] focus:outline-none focus:ring-1 focus:ring-[#7242f5] text-base transition-colors duration-200"
                                        placeholder="Введите новый пароль"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isUpdatingPassword}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Повторите пароль</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        className="mt-1 block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 shadow-sm focus:border-[#7242f5] focus:outline-none focus:ring-1 focus:ring-[#7242f5] text-base transition-colors duration-200"
                                        placeholder="Повторите новый пароль"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isUpdatingPassword}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdatingPassword}
                                style={{ backgroundColor: functionalColor }}
                                className={`w-full flex justify-center items-center gap-2 rounded-lg border border-transparent px-4 py-3 text-lg font-medium text-white shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#7242f5] focus:ring-offset-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${isUpdatingPassword ? '' : 'transform hover:-translate-y-0.5'}`}
                            >
                                {isUpdatingPassword ? (
                                    <>
                                        <GiSandsOfTime className="animate-spin" /> Обновление...
                                    </>
                                ) : (
                                    'Изменить пароль'
                                )}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}