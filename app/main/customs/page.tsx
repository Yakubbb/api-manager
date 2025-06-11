'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { deleteCustomItem, getAllCustomIems, ICustomItemForUser, likeCustomItem, togglePrivateCustomItem } from "@/server-side/custom-items-database-handler";
import { AiOutlinePlus } from 'react-icons/ai';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { ICustomItemForFront, ITag } from '@/custom-types';
import { CustomItemCard } from '@/customComponentsViews/custom-card';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { createPortal } from 'react-dom';

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

interface CustomConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmButtonText: string;
    confirmButtonClass: string;
}

const CustomConfirmDialog: React.FC<CustomConfirmDialogProps> = ({
    isOpen, onClose, onConfirm, title, message, confirmButtonText, confirmButtonClass
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-auto">
                <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-md text-white transition-colors ${confirmButtonClass}`}
                    >
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
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

    const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ICustomItemForUser | null>(null);

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

    const showTemporaryMessage = useCallback((msg: string, type: 'success' | 'error') => {
        setMessage(msg);
        setMessageType(type);
        const timer = setTimeout(() => {
            setMessage(null);
            setMessageType(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

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
                            ? userItem.item.likes.filter(id => id !== 'currentUserStub')
                            : [...userItem.item.likes, 'currentUserStub']
                    }
                } : userItem
            )
        );
        try {
            await likeCustomItem(itemId, itemType);
            showTemporaryMessage(`Лайк успешно ${items.find(i => i.item._id === itemId)?.isLiked ? 'удален' : 'добавлен'}!`, 'success');
        } catch (err) {
            console.error("Failed to toggle like:", err);
            showTemporaryMessage("Не удалось обновить лайк. Попробуйте еще раз.", 'error');
            setItems(originalItems);
        }
    }, [items, showTemporaryMessage]);

    const openDeleteConfirmDialog = useCallback((item: ICustomItemForUser) => {
        setItemToDelete(item);
        setShowConfirmDeleteDialog(true);
    }, []);

    const closeDeleteConfirmDialog = useCallback(() => {
        setShowConfirmDeleteDialog(false);
        setItemToDelete(null);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!itemToDelete) return;

        const originalItems = items;
        closeDeleteConfirmDialog();

        setIsLoading(true);

        try {
            await deleteCustomItem(itemToDelete.item._id, itemToDelete.item.type);
            setItems(currentItems => currentItems.filter(userItem => userItem.item._id !== itemToDelete.item._id));
            showTemporaryMessage(`Элемент "${itemToDelete.item.name}" (${itemToDelete.item.type}) успешно удален.`, 'success');
        } catch (err) {
            console.error("Failed to delete item:", err);
            showTemporaryMessage(`Не удалось удалить элемент "${itemToDelete.item.name}". Попробуйте еще раз.`, 'error');
            setItems(originalItems);
        } finally {
            setIsLoading(false);
            setItemToDelete(null);
        }
    }, [itemToDelete, items, closeDeleteConfirmDialog, showTemporaryMessage]);


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
            showTemporaryMessage(`Приватность элемента успешно ${!items.find(i => i.item._id === itemId)?.item.isPrivate ? 'установлена' : 'снята'}.`, 'success');
        } catch (err) {
            console.error("Failed to toggle privacy:", err);
            showTemporaryMessage("Не удалось изменить приватность. Попробуйте еще раз.", 'error');
            setItems(originalItems);
        }
    }, [items, showTemporaryMessage]);

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
                        userItem.item.tags.forEach(tag => {
                            if (!acc.some(existingTag => existingTag.name === tag.name)) {
                                acc.push(tag);
                            }
                        });
                    }
                    return acc;
                }, []);
                setAvailableTags(allTags.sort((a, b) => a.name.localeCompare(b.name)));

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

    const getMessageClasses = (type: 'success' | 'error' | null) => {
        if (!type) return '';
        return type === 'success'
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700';
    };

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

            {message && (
                <div
                    className={`p-3 rounded-md flex items-center justify-between text-sm mb-4 ${getMessageClasses(messageType)}`}
                    role="alert"
                >
                    <span>{message}</span>
                    <button
                        onClick={() => setMessage(null)}
                        className="ml-4 text-current hover:opacity-75 focus:outline-none"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="flex flex-grow overflow-hidden gap-6">
                <div className="flex-grow overflow-y-auto pt-0">
                    {isLoading && <p className="py-10 text-center text-lg text-gray-600">Загрузка пресетов...</p>}
                    {error && <p className="py-10 text-center text-lg text-red-600">{error}</p>}

                    {!isLoading && !error && (
                        displayedItems.length > 0 ? (
                            <div className="flex flex-wrap gap-6 w-full pb-4 justify-center">
                                {displayedItems.map((userItem) => (
                                    <CustomItemCard
                                        key={userItem.item._id}
                                        userItem={userItem}
                                        onLikeToggle={handleLikeToggle}
                                        onDelete={() => openDeleteConfirmDialog(userItem)}
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
                <div className="w-48 flex-shrink-0 overflow-y-auto pr-4">
                    <div className="mb-4 border-b border-gray-200 pb-4">
                        <button
                            className="flex w-full items-center justify-between text-sm font-medium text-gray-600 py-2 focus:outline-none"
                            onClick={toggleTypeFilter}
                        >
                            <span>Фильтр по типу:</span>
                            {isTypeFilterOpen ? <IoIosArrowUp className="h-4 w-4 transition-transform duration-200" /> : <IoIosArrowDown className="h-4 w-4 transition-transform duration-200" />}
                        </button>
                        {isTypeFilterOpen && (
                            <div className="mt-2 flex flex-col gap-2">
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
                                <div className="mt-2 flex flex-col gap-2">
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

            <CustomConfirmDialog
                isOpen={showConfirmDeleteDialog}
                onClose={closeDeleteConfirmDialog}
                onConfirm={confirmDelete}
                title="Подтвердить удаление"
                message={`Вы уверены, что хотите удалить элемент "${itemToDelete?.item.name}"? Это действие необратимо.`}
                confirmButtonText="Удалить"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
            />
        </div>
    );
}