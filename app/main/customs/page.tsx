"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { deleteCustomItem, getAllCustomIems, ICustomItemForUser, likeCustomItem, togglePrivateCustomItem } from "@/server-side/custom-items-database-handler";
import { AiOutlinePlus } from 'react-icons/ai';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { ICustomItemForFront } from '@/custom-types';
import { CustomItemCard, CustomItemCardProps } from '@/customComponentsViews/custom-card';

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
        <div className="mb-4 flex flex-wrap items-center gap-4 md:gap-6">
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

export default function CustomItemsPage() {
    const [items, setItems] = useState<ICustomItemForUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', order: 'asc' });
    const [selectedTypes, setSelectedTypes] = useState<ICustomItemForFront['type'][]>([]);

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

    const handleTypeFilterChange = useCallback((type: ICustomItemForFront['type'], isChecked: boolean) => {
        setSelectedTypes(prev => {
            if (isChecked) {
                return prev.includes(type) ? prev : [...prev, type];
            } else {
                return prev.filter(t => t !== type);
            }
        });
    }, []);

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
        const filtered = items.filter(userItem => {
            const matchesSearch = !searchTerm ||
                userItem.item.name.toLowerCase().includes(lowerSearch) ||
                (userItem.item.description && userItem.item.description.toLowerCase().includes(lowerSearch)) ||
                userItem.authorName.toLowerCase().includes(lowerSearch) ||
                userItem.item.type.toLowerCase().includes(lowerSearch);

            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(userItem.item.type);

            return matchesSearch && matchesType;
        });

        return [...filtered]
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
    }, [items, searchTerm, sortConfig, selectedTypes]);

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
                 <div className="mb-8 flex flex-wrap items-center gap-4 md:gap-6">
                    <span className="text-sm font-medium text-gray-600">Фильтр по типу:</span>
                    {(['prompt', 'systemPrompt', 'history', 'module'] as ICustomItemForFront['type'][]).map(type => (
                        <label key={type} className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                value={type}
                                checked={selectedTypes.includes(type)}
                                onChange={(e) => handleTypeFilterChange(type, e.target.checked)}
                                className="form-checkbox h-4 w-4 text-[#7242f5] rounded focus:ring-[#7242f5] mr-1"
                            />
                            <span className="text-sm text-gray-700 capitalize">{type}</span>
                        </label>
                    ))}
                 </div>
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
                            {searchTerm || selectedTypes.length > 0 ? 'Не найдено элементов, соответствующих вашему поиску/фильтру.' : 'Пока нет пользовательских пресетов. Создайте первый!'}
                        </p>
                    )
                )}
            </div>
        </div>
    );
}