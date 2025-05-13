'use client'

import { createCustomItem, getCustomItem, updateCustomItem } from "@/server-side/custom-items-database-handler"
import { useEffect, useState } from "react"
import PromptContent from "@/customComponentsViews/prompt-content";
import SystemPromptContent from "@/customComponentsViews/system-prompt-content";
import HistoryContent from "@/customComponentsViews/history-content";
import ModuleContent from '@/customComponentsViews/module-content';
import { IoMdClose } from 'react-icons/io';
import { BiCommentDetail } from 'react-icons/bi';
import CommentComponent from "@/customComponentsViews/comment-component";
import { getAllTags, getUserDataForFront } from "@/server-side/database-handler";
import TagSelector from "@/components/tag-selector";
import { ITag } from "@/custom-types";
import Tag from "@/components/tag";

const initialFormData = {
    _id: null,
    name: '',
    description: '',
    type: 'prompt',
    contents: '',
    isPrivate: false,
    photo: '',
    likes: [],
    authorId: null,
    comments: [],
    tags: []
}

const FUNCTIONAL_COLOR = '#7242f5';

export default function CustomItemPage({ params }: { params: Promise<{ id: string[] }> }) {

    const [viewMode, setViewMode] = useState('loading')
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState<any>(initialFormData)
    const [authorName, setAuthorName] = useState<string | null>(null)
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [newMessage, setNewMessage] = useState<string>('')
    const [newMessageRole, setNewMessageRole] = useState<'user' | 'model'>('user')
    const [updateStatus, setUpdateStatus] = useState<'idle' | 'updating' | 'success' | 'error'>('idle');
    const [isCommentsVisible, setIsCommentsVisible] = useState(true);
    const [newCommentText, setNewCommentText] = useState('');
    const [commentPostStatus, setCommentPostStatus] = useState<'idle' | 'posting' | 'posted' | 'error'>('idle');
    const [comments, setComments] = useState<any[]>([])
    const [tags, setTags] = useState<any[]>([])
    const [avalibleTags, setAvalibleTags] = useState<any[]>([])

    const handlers = {
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value, type } = e.target
            const checked = (e.target as HTMLInputElement).checked;
            let newValue = type === 'checkbox' ? checked : value;

            if (updateStatus === 'success' || updateStatus === 'error') {
                setUpdateStatus('idle');
            }

            if (name === 'type' && (viewMode === 'edit' || viewMode === 'create')) {
                const newType = value;
                let initialContents;
                switch (newType) {
                    case 'history':
                        initialContents = [];
                        break;
                    case 'module':
                        initialContents = { name: '', itsIntegrated: false, inputs: [], outputs: [] };
                        break;
                    default:
                        initialContents = '';
                        break;
                }
                setFormData((prev: any) => ({
                    ...prev,
                    [name]: newValue,
                    contents: initialContents,
                }));
            } else {
                if (name === 'contents') {
                    if (formData.type === 'history' || formData.type === 'module') {
                        return;
                    }
                    setFormData((prev: any) => ({
                        ...prev,
                        [name]: newValue,
                    }));
                } else {
                    setFormData((prev: any) => ({
                        ...prev,
                        [name]: newValue,
                    }));
                }
            }
        },

        handleAddMessage: () => {
            if (formData.type !== 'history') return;

            if (!newMessage.trim()) return

            const message = {
                role: newMessageRole,
                parts: [{ text: newMessage.trim() }],
            }

            setFormData((prev: any) => {
                const currentContents = Array.isArray(prev.contents) ? prev.contents : [];
                return {
                    ...prev,
                    contents: [...currentContents, message],
                }
            })

            if (updateStatus === 'success' || updateStatus === 'error') {
                setUpdateStatus('idle');
            }

            setNewMessage('')
        },

        handleSave: async () => {
            let contentsToSave = formData.contents;
            if (formData.type === 'history') {
                if (!Array.isArray(contentsToSave)) {
                    setError("Ошибка: Содержимое истории не является массивом.");
                    return;
                }
            } else if (formData.type === 'module') {
                if (typeof contentsToSave !== 'object' || contentsToSave === null || Array.isArray(contentsToSave)) {
                    setError("Ошибка: Содержимое модуля имеет неверный формат.");
                    return;
                }
            }
            else {
                if (typeof contentsToSave !== 'string') {
                    contentsToSave = String(contentsToSave ?? '');
                }
            }

            setUpdateStatus('updating');
            setError(null);

            try {
                const result = await createCustomItem(formData.type, { ...formData, contents: contentsToSave });
                setUpdateStatus('success');

                setTimeout(() => {
                    setUpdateStatus('idle');
                }, 2500);

            } catch (err: any) {
                setError(`Ошибка сохранения: ${err.message || 'Неизвестная ошибка'}`);
                setUpdateStatus('error');
            }
        },

        handleUpdate: async () => {
            if (!formData._id) {
                setError("Невозможно обновить: отсутствует ID элемента.");
                return;
            }

            let contentsToUpdate = formData.contents;
            if (formData.type === 'history') {
                if (!Array.isArray(contentsToUpdate)) {
                    setError("Ошибка: Содержимое истории не является массивом.");
                    return;
                }
            } else if (formData.type === 'module') {
                if (typeof contentsToUpdate !== 'object' || contentsToUpdate === null || Array.isArray(contentsToUpdate)) {
                    setError("Ошибка: Содержимое модуля имеет неверный формат.");
                    return;
                }
            }
            else {
                if (typeof contentsToUpdate !== 'string') {
                    contentsToUpdate = String(contentsToUpdate ?? '');
                }
            }

            setUpdateStatus('updating');
            setError(null);

            try {
                await updateCustomItem(formData.type, { ...formData, contents: contentsToUpdate }, formData._id);
                setUpdateStatus('success');

                setTimeout(() => {
                    setUpdateStatus('idle');
                }, 2500);

            } catch (err: any) {
                setError(`Ошибка обновления: ${err.message || 'Неизвестная ошибка'}`);
                setUpdateStatus('error');
            }
        },

        handlePostComment: async () => {
            if (!formData._id || !newCommentText.trim()) {
                setError("Невозможно отправить пустой комментарий.");
                return;
            }

            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };

            const user = await getUserDataForFront()

            setComments([...comments, { author: user.id, text: newCommentText, date: new Date().toLocaleString(undefined, options as any) }])
            setNewCommentText('');

        }
    }

    useEffect(() => {
        formData.comments = comments
        handlers.handleUpdate()
    }, [comments])

    useEffect(() => {
        formData.tags = tags
    }, [tags])

    useEffect(() => {
        const getParamsAndFetch = async () => {
            setViewMode('loading')
            setError(null)
            setFormData(initialFormData)
            setAuthorName(null)
            setIsLiked(false)
            setNewMessage('')
            setNewMessageRole('user')
            setUpdateStatus('idle');
            setCommentPostStatus('idle'); // Сбрасываем статус комментария при загрузке нового элемента

            try {

                const paramsData = (await params)?.id
                const hasValidParams = paramsData && paramsData.length >= 2 && paramsData[0] && paramsData[1]

                if (hasValidParams) {
                    const itemType = paramsData[0];
                    const itemId = paramsData[1];

                    const itemData = await getCustomItem(itemType as any, itemId);

                    if (itemData && itemData.item) {
                        let formattedContents = itemData.item.contents;

                        if (itemData.item.type === 'history') {
                            if (typeof formattedContents === 'string') {
                                try {
                                    formattedContents = JSON.parse(formattedContents);
                                    if (!Array.isArray(formattedContents)) formattedContents = [];
                                } catch {
                                    formattedContents = [];
                                }
                            } else if (!Array.isArray(formattedContents)) {
                                formattedContents = [];
                            }
                        } else if (itemData.item.type === 'module') {
                            if (typeof formattedContents === 'string') {
                                try {
                                    formattedContents = JSON.parse(formattedContents);
                                    if (typeof formattedContents !== 'object' || formattedContents === null || Array.isArray(formattedContents)) throw new Error("Invalid JSON structure for module");
                                    formattedContents.inputs = Array.isArray(formattedContents.inputs) ? formattedContents.inputs : [];
                                    formattedContents.outputs = Array.isArray(formattedContents.outputs) ? formattedContents.outputs : [];
                                } catch {
                                    formattedContents = { name: '', itsIntegrated: false, inputs: [], outputs: [] };
                                }
                            } else if (typeof formattedContents !== 'object' || formattedContents === null || Array.isArray(formattedContents)) {
                                formattedContents = { name: '', itsIntegrated: false, inputs: [], outputs: [] };
                            } else {
                                formattedContents.inputs = Array.isArray(formattedContents.inputs) ? formattedContents.inputs : [];
                                formattedContents.outputs = Array.isArray(formattedContents.outputs) ? formattedContents.outputs : [];
                            }
                        }
                        else {
                            if (typeof formattedContents !== 'string') {
                                formattedContents = String(formattedContents ?? '');
                            }
                        }
                        console.log(itemData)
                        setFormData({ ...itemData.item, contents: formattedContents })
                        setComments(itemData.item.comments || [])
                        setTags(itemData.item.tags || [])
                        setAvalibleTags((await getAllTags()).filter(t=>!itemData.item.tags?.find(tt=>t._id == tt._id)))
                        setAuthorName(itemData.authorName)
                        setIsLiked(itemData.isLiked)
                        setViewMode(itemData.isEditable ? 'edit' : 'view')

                    } else {
                        setViewMode('create')
                        const initialType = paramsData[0] || initialFormData.type;
                        let initialContents;
                        switch (initialType) {
                            case 'history': initialContents = []; break;
                            case 'module': initialContents = { name: '', itsIntegrated: false, inputs: [], outputs: [] }; break;
                            default: initialContents = ''; break;
                        }
                        setFormData({
                            ...initialFormData,
                            type: initialType,
                            contents: initialContents,
                        })
                    }
                } else {
                    setViewMode('create')
                    setFormData(initialFormData)
                }
            } catch (err: any) {
                setError(`Не удалось загрузить данные: ${err.message || 'Произошла ошибка'}`)
                setViewMode('error')
            }
        }
        getParamsAndFetch()
    }, [params])

    if (viewMode === 'loading') {
        return <div className="h-screen flex items-center justify-center">Загрузка...</div>
    }

    if (viewMode === 'error') {
        return (
            <div className="h-screen flex items-center justify-center p-6">
                <div className="max-w-md w-full p-6 bg-red-50 border border-red-200 rounded-lg shadow-md">
                    <h1 className="text-xl font-semibold text-red-800 mb-3">Ошибка</h1>
                    <p className="text-red-700">{error || 'Произошла неизвестная ошибка при загрузке данных.'}</p>
                </div>
            </div>
        );
    }

    const renderError = () => {
        if (!error) return null;
        // Отображаем ошибку только если она не связана с успешным обновлением/отправкой
        if (updateStatus === 'success' || commentPostStatus === 'posted') return null;
        return <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">{error}</div>
    }

    const isEditable = viewMode === 'edit' || viewMode === 'create'

    return (
        <div className="h-screen flex font-sans antialiased">
            {/* Левая панель (метаданные) */}
            <div className="w-1/3 max-w-md flex-shrink-0 h-full p-6 border-r border-gray-200 overflow-y-auto bg-white shadow-lg flex flex-col gap-5">
                <h1 className="text-2xl font-bold mb-1 text-gray-800">
                    {viewMode === 'create' ? 'Создать новый пресет' : 'Детали пресета'}
                </h1>
                {renderError()}

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Название</label>
                    {isEditable ? (
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handlers.handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7242f5] focus:border-[#7242f5] outline-none"
                            disabled={updateStatus === 'updating'}
                        />
                    ) : (
                        <p className="text-gray-800 p-2 bg-gray-50 rounded-lg">{formData.name || <span className="italic text-gray-400">Не указано</span>}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Описание</label>
                    {isEditable ? (
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handlers.handleInputChange}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7242f5] focus:border-[#7242f5] outline-none"
                            disabled={updateStatus === 'updating'}
                        />
                    ) : (
                        <p className="text-gray-700 whitespace-pre-wrap break-words p-2 bg-gray-50 rounded-lg">{formData.description || <span className="italic text-gray-400">Нет описания</span>}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Теги</label>
                    {isEditable ? (
                        <div>
                            <TagSelector options={avalibleTags} values={tags}
                                deleteValue={(value: ITag) => {
                                    setTags(tags.filter((t) => t._id != value._id))
                                    setAvalibleTags(
                                        [
                                            ...avalibleTags,
                                            value
                                        ]
                                    )
                                }}
                                updateValues={(value: ITag) => {
                                    setTags([
                                        ...tags,
                                        value
                                    ])

                                    setAvalibleTags(
                                        avalibleTags.filter((t) => t._id != value._id)
                                    )
                                }}
                            />

                        </div>
                    ) : (
                        <div>
                            {tags.map(t => {
                                return (
                                    <div>
                                        <Tag value={t} onClick={() => { }}/>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Тип</label>
                    {isEditable ? (
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handlers.handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-[#7242f5] focus:border-[#7242f5] outline-none"
                            disabled={updateStatus === 'updating'}
                        >
                            <option value="prompt">Запрос</option>
                            <option value="systemPrompt">Системный запрос</option>
                            <option value="history">История</option>
                            <option value="module">Модуль</option>
                        </select>
                    ) : (
                        <p className="text-gray-700 capitalize p-2 bg-gray-50 rounded-lg">
                            {formData.type === 'prompt' ? 'Запрос' : formData.type === 'systemPrompt' ? 'Системный запрос' : formData.type === 'history' ? 'История' : formData.type === 'module' ? 'Модуль' : formData.type}
                        </p>
                    )}
                </div>

                {isEditable && (
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="isPrivate"
                            name="isPrivate"
                            checked={formData.isPrivate}
                            onChange={handlers.handleInputChange}
                            className="h-4 w-4 text-[#7242f5] border-gray-300 rounded focus:ring-[#7242f5]"
                            disabled={updateStatus === 'updating'}
                        />
                        <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">
                            Сделать приватным
                        </label>
                    </div>
                )}

                {viewMode !== 'create' && (
                    <>
                        <hr className="my-3 border-gray-200" />
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-600">
                                <strong className="text-gray-800 font-medium">Автор:</strong> {authorName || 'Неизвестен'}
                            </p>
                            <p className="text-gray-600">
                                <strong className="text-gray-800 font-medium">Лайки:</strong> {formData.likes?.length || 0}
                            </p>
                            <p className="text-gray-600">
                                <strong className="text-gray-800 font-medium">Вам понравилось:</strong> {isLiked ? 'Да' : 'Нет'}
                            </p>
                            {formData.photo && (
                                <div>
                                    <strong className="text-gray-800 font-medium block mb-1">Фото:</strong>
                                    <img
                                        src={formData.photo}
                                        alt={formData.name || 'Фото пресета'}
                                        className="max-w-[100px] max-h-[100px] rounded-lg mt-1 border border-gray-200"
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="mt-auto pt-5 border-t border-gray-200">
                    {viewMode === 'create' && (
                        <button
                            onClick={handlers.handleSave}
                            style={{ backgroundColor: FUNCTIONAL_COLOR }}
                            className="w-full px-4 py-2.5 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-sm"
                            disabled={updateStatus === 'updating'}
                        >
                            {updateStatus === 'updating' ? 'Сохранение...' : 'Сохранить новый пресет'}
                        </button>
                    )}
                    {viewMode === 'edit' && (
                        <button
                            onClick={handlers.handleUpdate}
                            style={{
                                backgroundColor: updateStatus === 'success' ? '#4caf50' : FUNCTIONAL_COLOR
                            }}
                            className={`w-full px-4 py-2.5 text-white rounded-lg transition-all duration-200 font-semibold shadow-sm ${updateStatus === 'updating'
                                ? 'opacity-70 cursor-not-allowed'
                                : updateStatus === 'success'
                                    ? 'opacity-100'
                                    : updateStatus === 'error'
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'hover:opacity-90'
                                }`}
                            disabled={updateStatus === 'updating'}
                        >
                            {updateStatus === 'updating'
                                ? 'Обновление...'
                                : updateStatus === 'success'
                                    ? 'Обновлено!'
                                    : updateStatus === 'error'
                                        ? 'Ошибка! Повторить?'
                                        : 'Обновить пресет'}
                        </button>
                    )}
                    {viewMode === 'view' && (
                        <p className="text-center text-gray-500 italic text-sm">Режим просмотра. Редактирование запрещено.</p>
                    )}
                </div>
            </div>

            <div className={`flex-grow h-full p-6 bg-gray-50 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${isCommentsVisible ? 'w-1/2' : 'w-2/3'}`}>
                {formData.type === 'prompt' && (
                    <PromptContent
                        contents={formData.contents}
                        isEditable={isEditable}
                        handleInputChange={handlers.handleInputChange}
                        updateStatus={updateStatus}
                    />
                )}
                {formData.type === 'systemPrompt' && (
                    <SystemPromptContent
                        contents={formData.contents}
                        isEditable={isEditable}
                        handleInputChange={handlers.handleInputChange}
                        updateStatus={updateStatus}
                    />
                )}
                {formData.type === 'history' && (
                    <HistoryContent
                        contents={formData.contents}
                        isEditable={isEditable}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        newMessageRole={newMessageRole}
                        setNewMessageRole={setNewMessageRole}
                        handleAddMessage={handlers.handleAddMessage}
                        updateStatus={updateStatus}
                    />
                )}
                {formData.type === 'module' && (
                    <ModuleContent
                        contents={formData.contents}
                        isEditable={isEditable}
                        setFormData={setFormData}
                        updateStatus={updateStatus}
                    />
                )}
                {!['prompt', 'systemPrompt', 'history', 'module'].includes(formData.type) && (
                    <div className="flex flex-col h-full items-center justify-center text-gray-500">
                        <p>Неизвестный тип содержимого: {formData.type}</p>
                    </div>
                )}
            </div>

            <div className={`flex-shrink-0 transition-all duration-300 ease-in-out ${isCommentsVisible ? 'w-1/4 max-w-sm p-6 border-l border-gray-200' : 'w-0 p-0 overflow-hidden'} h-full bg-gray-100 flex flex-col`}>
                {isCommentsVisible && (
                    <div className="flex flex-col gap-4 h-full">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-300">
                            <h2 className="text-xl font-semibold text-gray-700">Комментарии</h2>
                            <button
                                onClick={() => setIsCommentsVisible(false)}
                                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7242f5]/50"
                                title="Скрыть комментарии"
                            >
                                <IoMdClose className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                            {comments.map((c, index) => {

                                return (
                                    <CommentComponent
                                        key={index}
                                        userId={c.author}
                                        text={c.text}
                                        date={c.date}
                                        onDelete={() => setComments(comments.filter(comment => comment != c))}
                                        authorID={formData.authorId}
                                    />
                                )
                            })}

                        </div>

                        <div className="flex-shrink-0 pt-4 border-t border-gray-300 mt-auto">
                            <h3 className="text-md font-semibold text-gray-700 mb-2">Добавить комментарий</h3>
                            <textarea
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder="Введите ваш комментарий..."
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7242f5] focus:border-[#7242f5] outline-none resize-none mb-2"
                                disabled={commentPostStatus === 'posting'}
                            />
                            <button
                                onClick={handlers.handlePostComment}
                                style={{ backgroundColor: FUNCTIONAL_COLOR }}
                                className={`w-full px-4 py-2 text-white rounded-lg transition-opacity font-semibold ${!newCommentText.trim() || commentPostStatus === 'posting' ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                                disabled={!newCommentText.trim() || commentPostStatus === 'posting'}
                            >
                                {commentPostStatus === 'posting' ? 'Отправка...' : 'Отправить комментарий'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {!isCommentsVisible && (
                <button
                    onClick={() => setIsCommentsVisible(true)}
                    className="fixed bottom-6 right-6 z-10 p-4 rounded-full bg-[#7242f5] text-white shadow-lg transition hover:bg-[#6135d4] focus:outline-none focus:ring-2 focus:ring-[#7242f5]/50"
                    title="Показать комментарии"
                >
                    <BiCommentDetail className="h-6 w-6" />
                </button>
            )}
        </div>
    )
}