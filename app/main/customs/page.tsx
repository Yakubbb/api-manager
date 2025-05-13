"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { deleteCustomItem, getAllCustomIems, ICustomItemForUser, likeCustomItem, togglePrivateCustomItem } from "@/server-side/custom-items-database-handler";
import { AiOutlineHeart, AiFillHeart, AiOutlinePlus } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { FaSort, FaSortUp, FaSortDown, FaLock, FaLockOpen } from 'react-icons/fa';
import { ICustomItemForFront } from '@/custom-types';

type SortableKeys = 'name' | 'authorName' | 'type' | 'likesCount';
interface SortConfig {
    key: SortableKeys;
    order: 'asc' | 'desc';
}

interface SearchSortControlsProps {
    searchTerm: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sortConfig: SortConfig;
    onSort: (key: SortableKeys) => void;
}

const SearchSortControls: React.FC<SearchSortControlsProps> = ({
    searchTerm,
    onSearchChange,
    sortConfig,
    onSort
}) => {
    const getSortIcon = (key: SortableKeys) => {
        if (sortConfig.key !== key) return <FaSort className="opacity-40" />;
        return sortConfig.order === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    return (
        <div className="mb-8 flex flex-wrap items-center gap-4 md:gap-6">
            <input
                type="text"
                placeholder="Искать элементы..."
                value={searchTerm}
                onChange={onSearchChange}
                className="flex-grow rounded-full border border-gray-300 px-5 py-2.5 shadow-sm focus:border-[#7242f5] focus:outline-none focus:ring-2 focus:ring-[#7242f5]/50 md:min-w-[300px]"
            />
            <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-medium text-gray-600">Сортировать по:</span>
                {(['name', 'authorName', 'type', 'likesCount'] as SortableKeys[]).map(key => (
                    <button
                        key={key}
                        onClick={() => onSort(key)}
                        className={`inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7242f5]/50 ${sortConfig.key === key ? 'bg-gray-200 font-semibold' : ''}`}
                    >
                        {
                            { name: 'Имени', authorName: 'Автору', type: 'Типу', likesCount: 'Лайкам' }[key]
                        }
                        {getSortIcon(key)}
                    </button>
                ))}
            </div>
        </div>
    );
};

interface CustomItemCardProps {
    userItem: ICustomItemForUser;
    onLikeToggle: (itemId: string, itemType: ICustomItemForFront['type']) => void;
    onDelete: (itemId: string, itemType: ICustomItemForFront['type']) => void;
    onPrivacyToggle: (itemId: string, itemType: ICustomItemForFront['type']) => void;
}

const CustomItemCard: React.FC<CustomItemCardProps> = ({ userItem, onLikeToggle, onDelete, onPrivacyToggle }) => {
    const { item, isEditable, isLiked, authorName } = userItem;

    const getTypeBadgeClasses = (type: ICustomItemForFront['type']): string => {
        let classes = 'inline-block rounded-full px-2.5 py-1 text-xs font-semibold ';
        switch (type) {
            case 'prompt': classes += 'bg-blue-100 text-blue-800'; break;
            case 'systemPrompt': classes += 'bg-green-100 text-green-800'; break;
            case 'history': classes += 'bg-orange-100 text-orange-800'; break;
            case 'module': classes += 'bg-[#7242f5] text-white'; break;
            default: classes += 'bg-gray-100 text-gray-800'; break;
        }
        return classes;
    };

    const getTypePath = (type: ICustomItemForFront['type']): string => {
        switch (type) {
            case 'history': return 'histories';
            case 'prompt':
            case 'systemPrompt': return 'prompts';
            case 'module': return 'modules'
            default: return 'unknown';
        }
    };

    const detailUrl = `/main/customs/${getTypePath(item.type)}/${item._id}`;

    return (
        <div className="flex w-full flex-col overflow-hidden rounded-2xl border-2 border-gray-200 bg-white transition hover:shadow-xl sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]">
            <Link href={detailUrl} className="flex flex-grow flex-col">
                {item.photo && (
                    <div className="relative h-48 w-full">
                        <img
                            src={item.photo}
                            alt={item.name}
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    </div>
                )}
                <div className="flex flex-grow flex-col p-5 pb-0">
                    <div className="mb-2 flex items-start justify-between gap-3">
                        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                    </div>
                    <div className="flex flex-row gap-2 mb-2 text-sm text-gray-500 items-center text-center">
                        <div>Тип:</div>
                        <span className={getTypeBadgeClasses(item.type)}>{item.type}</span>
                    </div>
                    <p className="mb-4 text-sm text-gray-500">Автор: {authorName}</p>
                    <p className="mb-5 flex-grow text-base text-gray-700 line-clamp-3 font-main2">
                        {item.description}
                    </p>
                </div>
            </Link>

            <div className="mt-auto flex items-center justify-between border-t border-gray-100 p-5 pt-4">
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => onLikeToggle(item._id, item.type)}
                        title={isLiked ? "Убрать лайк" : "Поставить лайк"}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7242f5]/50 ${isLiked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-500'}`}
                    >
                        {isLiked ? <AiFillHeart className="h-5 w-5" /> : <AiOutlineHeart className="h-5 w-5" />}
                        <span>{item.likes.length}</span>
                    </button>
                    {isEditable && (
                        <button
                            onClick={() => onPrivacyToggle(item._id, item.type)}
                            title={item.isPrivate ? "Сделать публичным" : "Сделать приватным"}
                            className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7242f5]/50"
                        >
                            {item.isPrivate
                                ? <FaLock className="h-4 w-4" />
                                : <FaLockOpen className="h-4 w-4" />}
                        </button>
                    )}
                    {!isEditable && item.isPrivate && (
                        <FaLock className="ml-2 h-4 w-4 flex-shrink-0 text-gray-400" title="Приватный элемент" />
                    )}
                </div>

                {isEditable && (
                    <button
                        onClick={() => onDelete(item._id, item.type)}
                        title="Удалить"
                        className="rounded-full p-2 text-gray-500 transition hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    >
                        <MdDelete className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default function CustomItemsPage() {
    const [items, setItems] = useState<ICustomItemForUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', order: 'asc' });

    const handleLikeToggle = useCallback(async (itemId: string, itemType: ICustomItemForFront['type']) => {
        const originalItems = items;
        setItems(currentItems =>
            currentItems.map(userItem =>
                userItem.item._id === itemId ? {
                    ...userItem,
                    isLiked: !userItem.isLiked,
                    item: {
                        ...userItem.item,
                        likes: userItem.isLiked
                            ? userItem.item.likes.filter(id => id !== 'currentUser')
                            : [...userItem.item.likes, 'currentUser']
                    }
                } : userItem
            )
        );
        try {
            await likeCustomItem(itemId, itemType);
        } catch (err) {
            console.error("Failed to toggle like:", err);
            setError("Не удалось обновить лайк. Попробуйте еще раз.");
            setItems(originalItems);
        }
    }, [items]);

    const handleDelete = useCallback(async (itemId: string, itemType: ICustomItemForFront['type']) => {
        const originalItems = items;
        if (window.confirm(`Вы уверены, что хотите удалить этот ${itemType}?`)) {
            setItems(currentItems => currentItems.filter(userItem => userItem.item._id !== itemId));
            try {
                await deleteCustomItem(itemId, itemType);
            } catch (err) {
                console.error("Failed to delete item:", err);
                setError("Не удалось удалить элемент. Попробуйте еще раз.");
                setItems(originalItems);
            }
        }
    }, [items]);

    const handlePrivacyToggle = useCallback(async (itemId: string, itemType: ICustomItemForFront['type']) => {
        const originalItems = items;
        setItems(currentItems =>
            currentItems.map(userItem =>
                userItem.item._id === itemId ? {
                    ...userItem,
                    item: {
                        ...userItem.item,
                        isPrivate: !userItem.item.isPrivate,
                    }
                } : userItem
            )
        );
        try {
            await togglePrivateCustomItem(itemId, itemType);
        } catch (err) {
            console.error("Failed to toggle privacy:", err);
            setError("Не удалось изменить приватность. Попробуйте еще раз.");
            setItems(originalItems);
        }
    }, [items]);


    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedItems = await getAllCustomIems(false);
                setItems(fetchedItems);
            } catch (err) {
                console.error("Не удалось получить пользовательские пресеты:", err);
                setError("Не удалось загрузить пресеты. Пожалуйста, попробуйте позже.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();
    }, []);

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, []);

    const handleSort = useCallback((key: SortableKeys) => {
        setSortConfig(current => ({
            key,
            order: current.key === key && current.order === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    const displayedItems = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return [...items]
            .filter(userItem => !searchTerm ||
                userItem.item.name.toLowerCase().includes(lowerSearch) ||
                (userItem.item.description && userItem.item.description.toLowerCase().includes(lowerSearch)) ||
                userItem.authorName.toLowerCase().includes(lowerSearch) ||
                userItem.item.type.toLowerCase().includes(lowerSearch)
            )
            .sort((a, b) => {
                const { key, order } = sortConfig;
                let valA: string | number;
                let valB: string | number;

                switch (key) {
                    case 'likesCount':
                        valA = a.item.likes.length; valB = b.item.likes.length; break;
                    case 'name':
                        valA = a.item.name.toLowerCase(); valB = b.item.name.toLowerCase(); break;
                    case 'authorName':
                        valA = a.authorName.toLowerCase(); valB = b.authorName.toLowerCase(); break;
                    case 'type':
                        valA = a.item.type.toLowerCase(); valB = b.item.type.toLowerCase(); break;
                    default: return 0;
                }

                if (valA < valB) return order === 'asc' ? -1 : 1;
                if (valA > valB) return order === 'asc' ? 1 : -1;

                if (key !== 'name') {
                    const nameA = a.item.name.toLowerCase();
                    const nameB = b.item.name.toLowerCase();
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                }
                return 0;
            });
    }, [items, searchTerm, sortConfig]);

    return (
        <div className="flex flex-col mx-auto h-screen p-4 md:px-6 md:py-8 overflow-hidden bg-gray-50">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-800">Пользовательские пресеты</h1>
                <Link
                    href={'/main/customs/histories'}
                    className="inline-flex items-center gap-2 rounded-full bg-[#7242f5] px-6 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#6135d4] focus:outline-none focus:ring-2 focus:ring-[#7242f5] focus:ring-offset-2"
                >
                    <AiOutlinePlus className="h-5 w-5" />
                    Создать новый
                </Link>
            </div>

            <div className="flex-shrink-0">
                <SearchSortControls
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                />
            </div>

            <div className="flex-grow overflow-y-auto pt-4">
                {isLoading && <p className="py-10 text-center text-lg text-gray-600">Загрузка пресетов...</p>}
                {error && <p className="py-10 text-center text-lg text-red-600">{error}</p>}

                {!isLoading && !error && (
                    displayedItems.length > 0 ? (
                        <div className="flex flex-wrap gap-6 w-full pb-4">
                            {displayedItems.map((userItem) => (
                                <CustomItemCard
                                    key={userItem.item._id}
                                    userItem={userItem}
                                    onLikeToggle={handleLikeToggle}
                                    onDelete={handleDelete}
                                    onPrivacyToggle={handlePrivacyToggle}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-12 text-center text-lg text-gray-500">
                            {searchTerm ? 'Не найдено элементов, соответствующих вашему поиску.' : 'Пока нет пользовательских пресетов. Создайте первый!'}
                        </p>
                    )
                )}
            </div>
        </div>
    );
}