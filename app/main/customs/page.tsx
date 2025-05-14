"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { deleteCustomItem, getAllCustomIems, ICustomItemForUser, likeCustomItem, togglePrivateCustomItem } from "@/server-side/custom-items-database-handler";
import { AiOutlinePlus } from 'react-icons/ai';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { ICustomItemForFront, ITag } from '@/custom-types';
import { CustomItemCard } from '@/customComponentsViews/custom-card';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

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
    const [availableTags, setAvailableTags] = useState<ITag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(true);
    const [isTagFilterOpen, setIsTagFilterOpen] = useState(true);

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

    const handleTagFilterChange = useCallback((tagName: string, isChecked: boolean) => {
        setSelectedTags(prev => {
            if (isChecked) {
                return prev.includes(tagName) ? prev : [...prev, tagName];
            } else {
                return prev.filter(tag => tag !== tagName);
            }
        });
    }, []);

    const toggleTypeFilter = useCallback(() => {
        setIsTypeFilterOpen(prev => !prev);
    }, []);

    const toggleTagFilter = useCallback(() => {
        setIsTagFilterOpen(prev => !prev);
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedItems = await getAllCustomIems(false);
                setItems(fetchedItems);

                const allTags: ITag[] = fetchedItems.reduce((acc: ITag[], userItem) => {
                    if (userItem.item.tags && Array.isArray(userItem.item.tags)) {
                        acc.push(...userItem.item.tags);
                    }
                    return acc;
                }, []);
                const uniqueTags = Array.from(new Map(allTags.map(tag => [tag.name, tag])).values());
                setAvailableTags(uniqueTags);

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
                userItem.item.type.toLowerCase().includes(lowerSearch) ||
                (userItem.item.tags && Array.isArray(userItem.item.tags) &&
                    userItem.item.tags.some(tag => tag.name.toLowerCase().includes(lowerSearch)));

            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(userItem.item.type);

            const matchesTags = selectedTags.length === 0 ||
                (userItem.item.tags && Array.isArray(userItem.item.tags) &&
                    userItem.item.tags.some(tag => selectedTags.includes(tag.name)));

            return matchesSearch && matchesType && matchesTags;
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
    }, [items, searchTerm, sortConfig, selectedTypes, selectedTags]);

    return (
        <div className="flex flex-col mx-auto h-screen p-4 md:px-6 md:py-8 overflow-hidden bg-gray-50">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-800">Библиотека сообщества</h1>
                <Link
                    href={'/main/customs/histories'}
                    className="inline-flex items-center gap-2 rounded-full bg-[#7242f5] px-6 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#6135d4] focus:outline-none focus:ring-2 focus:ring-[#7242f5] focus:ring-offset-2"
                >
                    <AiOutlinePlus className="h-5 w-5" />
                    Добавить
                </Link>
            </div>

            <SearchSortControls
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                sortConfig={sortConfig}
                onSort={handleSort}
            />

            <div className="flex flex-grow overflow-hidden gap-6"> {/* Container for filters and items */}
                <div className="flex-grow overflow-y-auto pt-0"> {/* Removed pt-4 as padding is on parent flex */}
                    {isLoading && <p className="py-10 text-center text-lg text-gray-600">Загрузка пресетов...</p>}
                    {error && <p className="py-10 text-center text-lg text-red-600">{error}</p>}

                    {!isLoading && !error && (
                        displayedItems.length > 0 ? (
                            <div className="flex flex-wrap gap-6 w-full pb-4 justify-center"> {/* Added justify-center for better layout */}
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
                                {searchTerm || selectedTypes.length > 0 || selectedTags.length > 0 ? 'Не найдено элементов, соответствующих вашему поиску/фильтру.' : 'Пока нет пользовательских пресетов. Создайте первый!'}
                            </p>
                        )
                    )}
                </div>
                <div className="w-48 flex-shrink-0 overflow-y-auto pr-4"> {/* Added pr-4 for spacing */}
                    {/* Type Filter Section with Collapse */}
                    <div className="mb-4 border-b border-gray-200 pb-4">
                        <button
                            className="flex w-full items-center justify-between text-sm font-medium text-gray-600 py-2 focus:outline-none"
                            onClick={toggleTypeFilter}
                        >
                            <span>Фильтр по типу:</span>
                            {isTypeFilterOpen ? <IoIosArrowUp className="h-4 w-4 transition-transform duration-200" /> : <IoIosArrowDown className="h-4 w-4 transition-transform duration-200" />}
                        </button>
                        {isTypeFilterOpen && (
                            <div className="mt-2 flex flex-col gap-2"> {/* Changed to flex-col for vertical stacking */}
                                {(['prompt', 'systemPrompt', 'history', 'module', 'path'] as ICustomItemForFront['type'][]).map(type => (
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
                        )}
                    </div>

                    {/* Tag Filter Section with Collapse */}
                    {availableTags.length > 0 && (
                        <div className="mb-8 border-b border-gray-200 pb-4">
                            <button
                                className="flex w-full items-center justify-between text-sm font-medium text-gray-600 py-2 focus:outline-none"
                                onClick={toggleTagFilter}
                            >
                                <span>Фильтр по тегам:</span>
                                {isTagFilterOpen ? <IoIosArrowUp className="h-4 w-4 transition-transform duration-200" /> : <IoIosArrowDown className="h-4 w-4 transition-transform duration-200" />}
                            </button>
                            {isTagFilterOpen && (
                                <div className="mt-2 flex flex-col gap-2"> {/* Changed to flex-col for vertical stacking */}
                                    {availableTags.map(tag => (
                                        <label key={tag.name} className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value={tag.name}
                                                checked={selectedTags.includes(tag.name)}
                                                onChange={(e) => handleTagFilterChange(tag.name, e.target.checked)}
                                                className="form-checkbox h-4 w-4 text-[#7242f5] rounded focus:ring-[#7242f5] mr-1"
                                            />
                                            <span className="text-sm text-gray-700">{tag.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}