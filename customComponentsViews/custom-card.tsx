import React from 'react';
import Link from 'next/link';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { ICustomItemForUser } from "@/server-side/custom-items-database-handler";
import { ICustomItemForFront, ITag } from '@/custom-types';
import Tag from '@/components/tag';

export interface CustomItemCardProps {
    userItem: ICustomItemForUser;
    onLikeToggle: (itemId: string, itemType: ICustomItemForFront['type']) => void;
    onDelete: (itemId: string, itemType: ICustomItemForFront['type']) => void;
    onPrivacyToggle: (itemId: string, itemType: ICustomItemForFront['type']) => void;
}

export const CustomItemCard: React.FC<CustomItemCardProps> = ({ userItem, onLikeToggle, onDelete, onPrivacyToggle }) => {
    console.log(userItem)
    const { item, isEditable, isLiked, authorName } = userItem;

    const getTypeBadgeClasses = (type: ICustomItemForFront['type']): string => {
        let classes = 'inline-block rounded-full px-2.5 py-1 text-xs font-semibold p-2 ';
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
        <div className="flex flex-grow w-64 flex-col overflow-hidden rounded-2xl border-2 border-gray-200 bg-white transition hover:shadow-xl">
            <Link href={detailUrl} className="flex flex-grow flex-col">
                {item.photo && (
                    <div className="relative h-48 w-full">
                        <img
                            src={item.photo}
                            alt={item.name || 'Custom Item Photo'}
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    </div>
                )}
                <div className="flex flex-grow flex-col p-5">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 font-main2">{item.name}</h3>

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <span>Тип:</span>
                            <span className={getTypeBadgeClasses(item.type)}>{item.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>Автор:</span>
                            <span className="text-gray-700 font-medium">{authorName}</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-2 mb-2 mt-2 w-full'>
                        {
                            (userItem.item.tags! as ITag[]).map((t, index) => {
                                return (
                                    <div key={index} className='w-min text-xs '>
                                        <Tag value={t} onClick={() => { }} />
                                    </div>
                                )
                            })
                        }
                    </div>

                    <p className="flex-grow text-base text-gray-700 line-clamp-3 font-main2">
                        {item.description || 'Нет описания'}
                    </p>
                </div>
            </Link>

            <div className="mt-auto flex items-center justify-between border-t border-gray-100 p-5 pt-4">
                <div className='flex items-center gap-2'>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLikeToggle(item._id, item.type); }}
                        title={isLiked ? "Убрать лайк" : "Поставить лайк"}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7242f5] ${isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-500'}`}
                    >
                        {isLiked ? <AiFillHeart className="h-5 w-5" /> : <AiOutlineHeart className="h-5 w-5" />}
                        <span>{item.likes.length}</span>
                    </button>
                    {isEditable && (
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPrivacyToggle(item._id, item.type); }}
                            title={item.isPrivate ? "Сделать публичным" : "Сделать приватным"}
                            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7242f5]/50"
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
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(item._id, item.type); }}
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