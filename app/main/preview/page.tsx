'use client';

import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import * as googleTTS from 'google-tts-api';
import { getGooleVoice64 } from "@/components/voiceTest";

interface AcceptableStatus {
    acceptable: boolean;
    cause?: string;
}

function PreviewBlock({ name, content, description, pathHref }: { name: string, content: ReactElement, description: string, pathHref: string }) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-[#f3f3f6] shadow-sm p-6">
            <div className="flex flex-row items-center justify-between text-xl font-bold text-gray-800 w-full">
                <div>
                    {name}
                </div>
                <Link href={pathHref} className="flex flex-row gap-2 rounded-xl p-2 text-[#7242f5] font-main2 items-center text-center">
                    <FaExternalLinkAlt />
                    Перейти
                </Link>
            </div>
            <div className="flex flex-row gap-2 p-4 bg-[#E6E0F7] font-main2 font-semibold rounded-lg text-gray-600">
                {description}
            </div>
            <div className="p-4 bg-white rounded-xl border-2 border-gray-200">
                {content}
            </div>
        </div>
    );
}

function LogsForm({ inputs, outputs }: { inputs: { name: string, value: any }[], outputs: { name: string, value: any }[] }) {
    const formatValue = (value: any): string => {
        if (typeof value === 'object' && value !== null) {
            try {
                return JSON.stringify(value, null, 2);
            } catch (e) {
                return String(value);
            }
        }
        return String(value);
    };

    return (
        <div className="flex flex-col bg-white gap-4 w-1/2 rounded-lg border border-gray-200 shadow-sm p-4 overflow-hidden">
            <div className="flex flex-col rounded-md bg-gray-50 w-full h-1/2 p-4 border border-gray-200 overflow-y-auto">
                <div className="flex flex-row items-center gap-2 text-lg font-semibold text-[#7242f5] mb-2">
                    запрос:
                </div>
                <div className="flex flex-col gap-2 text-sm font-mono text-gray-700">
                    <span className="font-bold text-[#7242f5]">{`{`}</span>
                    {inputs.map((i, index) => (
                        <div key={index} className="flex flex-row gap-2 ml-4">
                            <span className="font-semibold text-gray-800">{i.name}</span>
                            <span>:</span>
                            <span className="text-green-700">{formatValue(i.value)}</span>
                        </div>
                    ))}
                    <span className="font-bold text-[#7242f5]">{`}`}</span>
                </div>
            </div>
            <div className="flex flex-col rounded-md bg-gray-50 w-full h-1/2 p-4 border border-gray-200 overflow-y-auto">
                <div className="flex flex-row items-center gap-2 text-lg font-semibold text-[#7242f5] mb-2">
                    ответ:
                </div>
                <div className="flex flex-col gap-2 text-sm font-mono text-gray-700">
                    <span className="font-bold text-[#7242f5]">{`{`}</span>
                    {outputs.map((i, index) => (
                        <div key={index} className="flex flex-row gap-2 ml-4">
                            <span className="font-semibold text-gray-800">{i.name}</span>
                            <span>:</span>
                            <span className="text-green-700">{formatValue(i.value)}</span>
                        </div>
                    ))}
                    <span className="font-bold text-[#7242f5]">{`}`}</span>
                </div>
            </div>
        </div>
    );
}

function LoginTestForm() {
    const [inputs, setInputs] = useState<{ name: string, value: any }[]>([{ name: 'userPrompt', value: '' }]);
    const [outputs, setOutputs] = useState<{ name: string, value: any }[]>([{ name: 'acceptable', value: '' }]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');

    const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = () => {
        setError(null);
        setIsLoading(true);
        const asyncFetch = async () => {
            try {
                const response = await fetch('/api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        path: '682b44f4dd2d0616ab85eb76',
                        values: [
                            {
                                id: 'userPrompt',
                                value: nickname
                            }
                        ]
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseData = await response.json();
                const item = (responseData as any[]).find(e => e.id === 'ten-1747665558553');

                if (!item) {
                    throw new Error("Item with id 'ten-1747665558553' not found in response.");
                }

                if (typeof item.value !== 'string') {
                    throw new Error("Item value is not a string.");
                }

                const value = JSON.parse(item.value) as AcceptableStatus;

                let newOutputs = [
                    {
                        name: 'acceptable',
                        value: value.acceptable
                    }
                ] as { name: string, value: any }[];

                if (value.cause) {
                    newOutputs.push({
                        name: 'cause',
                        value: value.cause
                    });
                }

                setOutputs(newOutputs);

            } catch (e: any) {
                console.error("Fetch or parse error:", e);
                setError(`Ошибка: ${e.message}`);
                setOutputs([]);
            } finally {
                setIsLoading(false);
            }
        };
        asyncFetch();
    };

    useEffect(() => {
        setInputs([{ name: 'userPrompt', value: nickname }]);
    }, [nickname]);

    return (
        <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex flex-col gap-5 p-6 border border-gray-200 rounded-lg shadow-lg w-full md:w-1/2 max-w-sm mx-auto bg-white">
                <div className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Создать аккаунт
                </div>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nickname">
                            Никнейм
                        </label>
                        <input
                            id="nickname"
                            type="text"
                            placeholder="Введите никнейм"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7242f5] focus:border-[#7242f5] disabled:opacity-50 disabled:cursor-not-allowed"
                            value={nickname}
                            onChange={handleNicknameChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                            Пароль
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Введите пароль"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7242f5] focus:border-[#7242f5] disabled:opacity-50 disabled:cursor-not-allowed"
                            value={password}
                            onChange={handlePasswordChange}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        className="w-full bg-[#7242f5] text-white py-2 px-4 rounded-md hover:bg-[#7242f5] focus:outline-none focus:ring-2 focus:ring-[#7242f5] focus:ring-offset-2 text-lg font-medium mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : 'Создать аккаунт'}
                    </button>
                    {error && (
                        <div className="text-red-500 text-sm text-center mt-2">
                            {error}
                        </div>
                    )}
                </div>
            </div>
            <LogsForm inputs={inputs} outputs={outputs} />
        </div>
    );
}

function PhoneCharacteristicsForm() {

    const [inputs, setInputs] = useState<{ name: string, value: any }[]>([{ name: 'userPrompt', value: '' }]);
    const [outputs, setOutputs] = useState<{ name: string, value: any }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [ram, setRam] = useState('');
    const [storage, setStorage] = useState('');
    const [price, setPrice] = useState(500);

    const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBrand(event.target.value);
    };

    const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModel(event.target.value);
    };

    const handleRamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRam(event.target.value);
    };

    const handleStorageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStorage(event.target.value);
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(parseInt(event.target.value, 10));
    };

    useEffect(() => {
        setInputs([{
            name: 'userPrompt',
            value: `
            модель: ${model} с ценой: ${price} в рублях, бренд называется ${brand}. Количество оперативной памяти: ${ram}gb
            и объемом памяти ${storage}gb
            `
        }])

    }, [brand, model, storage, price, ram])


    const handleSubmit = () => {
        setError(null);
        setIsLoading(true);
        const asyncFetch = async () => {
            try {
                const response = await fetch('/api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        path: '682b87984a0062bee8bd622c',
                        values: [
                            {
                                id: 'userPrompt',
                                value: inputs.find(i => i.name == 'userPrompt')?.value
                            }
                        ]
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseData = await response.json();
                const item = (responseData as any[]).find(e => e.id === 'city-1747682914384');

                if (!item) {
                    throw new Error("Item with id 'city-1747682914384' not found in response.");
                }

                if (typeof item.value !== 'string') {
                    throw new Error("Item value is not a string.");
                }

                const value = JSON.parse(item.value) as any;

                let newOutputs = [
                    {
                        name: 'review',
                        value: value.review
                    },
                    {
                        name: 'rating',
                        value: value.rating
                    },
                    {
                        name: 'reccomended_price',
                        value: value.reccomended_price
                    },
                ]
                setOutputs(newOutputs);
            } catch (e: any) {
                console.error("Fetch or parse error:", e);
                setError(`Ошибка: ${e.message}`);
                setOutputs([]);
            } finally {
                setIsLoading(false);
            }
        };
        asyncFetch();
    };

    return (
        <div className="flex flex-row">
            <div className="w-1/2 flex flex-col gap-5 p-6 border border-gray-200 rounded-lg shadow-lg w-full max-w-sm mx-auto bg-white">
                <div className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Характеристики телефона
                </div>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="brand">
                            Бренд
                        </label>
                        <input
                            id="brand"
                            type="text"
                            placeholder="Введите бренд"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7242f5] focus:border-[#7242f5] disabled:opacity-50 disabled:cursor-not-allowed"
                            value={brand}
                            onChange={handleBrandChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="model">
                            Модель
                        </label>
                        <input
                            id="model"
                            type="text"
                            placeholder="Введите модель"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7242f5] focus:border-[#7242f5] disabled:opacity-50 disabled:cursor-not-allowed"
                            value={model}
                            onChange={handleModelChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ram">
                            ОЗУ (RAM)
                        </label>
                        <input
                            id="ram"
                            type="text"
                            placeholder="Введите объем ОЗУ"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7242f5] focus:border-[#7242f5] disabled:opacity-50 disabled:cursor-not-allowed"
                            value={ram}
                            onChange={handleRamChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storage">
                            Встроенная память
                        </label>
                        <input
                            id="storage"
                            type="text"
                            placeholder="Введите объем памяти"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7242f5] focus:border-[#7242f5] disabled:opacity-50 disabled:cursor-not-allowed"
                            value={storage}
                            onChange={handleStorageChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
                            Цена
                        </label>
                        <input
                            id="price"
                            type="range"
                            min="100"
                            max="2000"
                            step="10"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            value={price}
                            onChange={handlePriceChange}
                            disabled={isLoading}
                        />
                        <p className="text-center text-gray-600">Цена: ${price}</p>
                    </div>
                    <button
                        className="w-full bg-[#7242f5] text-white py-2 px-4 rounded-md hover:bg-[#7242f5] focus:outline-none focus:ring-2 focus:ring-[#7242f5] focus:ring-offset-2 text-lg font-medium mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : 'Отправить'}
                    </button>
                    {error && (
                        <div className="text-red-500 text-sm text-center mt-2">
                            {error}
                        </div>
                    )}
                </div>
            </div>
            <LogsForm inputs={inputs} outputs={outputs} />
        </div>
    );
}


export default function ExamplesPage() {

    useEffect(() => {
        const fetchDataAsync = async () => {
            console.log(await getGooleVoice64('aboba','en'))
        }
        fetchDataAsync()
    }, [])

    return (
        <div className="w-full h-full py-8 px-4">
            <div className="text-3xl font-extrabold text-gray-900 mb-8">Примеры использования</div>
            <div className="w-full h-full flex flex-col gap-8 overflow-auto p-8">
                <PreviewBlock
                    name="Нежелательный контент"
                    description="Проверка вводимых пользователями данных на содержание запрещенной лексики"
                    pathHref="/main/customs/paths/682b44f4dd2d0616ab85eb76"
                    content={
                        <LoginTestForm />
                    }
                />
                <PreviewBlock
                    name="Характеристики телефона"
                    description="Пример формы с несколькими полями для ввода характеристик телефона"
                    pathHref="/main/customs/paths/682b87984a0062bee8bd622c"
                    content={
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <PhoneCharacteristicsForm />
                        </div>
                    }
                />
            </div>
        </div>
    );
}