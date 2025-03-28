'use client'

import { createCustomItem, getCustomItem, updateCustomItem } from "@/server-side/custom-items-database-handler"
import { useEffect, useState, useRef } from "react"

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
}

const FUNCTIONAL_COLOR = '#7242f5';

export default function ({ params }: { params: Promise<{ id: string[] }> }) {

    const [viewMode, setViewMode] = useState('loading')
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState<any>(initialFormData)
    const [authorName, setAuthorName] = useState<string | null>(null)
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [newMessage, setNewMessage] = useState<string>('')
    const [newMessageRole, setNewMessageRole] = useState<'user' | 'model'>('user')
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [updateStatus, setUpdateStatus] = useState<'idle' | 'updating' | 'success' | 'error'>('idle');

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
                setFormData((prev: any) => ({
                    ...prev,
                    [name]: newValue,
                    contents: newType === 'history' ? [] : ''
                }));
                console.log(`Обновлено ${name}:`, newValue, `Сброшено содержимое для типа ${newType}`);
            } else {
                setFormData((prev: any) => ({
                    ...prev,
                    [name]: newValue,
                }));
                console.log(`Обновлено ${name}:`, newValue);
            }
        },

        handleAddMessage: () => {
            if (!newMessage.trim()) return

            const message = {
                role: newMessageRole,
                parts: [{ text: newMessage.trim() }],
            }

            setFormData((prev: any) => {
                const currentContents = Array.isArray(prev.contents) ? prev.contents : []
                return {
                    ...prev,
                    contents: [...currentContents, message],
                }
            })

            if (updateStatus === 'success' || updateStatus === 'error') {
                setUpdateStatus('idle');
            }

            console.log("Добавление сообщения:", message)
            setNewMessage('')
        },

        handleFileImport: (event: React.ChangeEvent<HTMLInputElement>) => {
            if (updateStatus === 'success' || updateStatus === 'error') {
                setUpdateStatus('idle');
            }
            const file = event.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonContent = e.target?.result;
                    if (typeof jsonContent !== 'string') throw new Error("Не удалось прочитать содержимое файла.");
                    const importedData = JSON.parse(jsonContent);

                    if (!importedData.name || !importedData.type || importedData.contents === undefined) {
                        throw new Error("В импортированном JSON отсутствуют обязательные поля (name, type, contents).");
                    }

                    let formattedContents = importedData.contents;
                    if (importedData.type === 'history' && !Array.isArray(formattedContents)) {
                        try {
                            if (typeof formattedContents === 'string') formattedContents = JSON.parse(formattedContents);
                            if (!Array.isArray(formattedContents)) formattedContents = [];
                        } catch { formattedContents = []; }
                    } else if (importedData.type !== 'history' && typeof formattedContents !== 'string') {
                        formattedContents = JSON.stringify(formattedContents, null, 2);
                    }

                    setFormData((prev: any) => ({
                        ...prev,
                        name: importedData.name !== undefined ? importedData.name : prev.name,
                        description: importedData.description !== undefined ? importedData.description : prev.description,
                        type: importedData.type !== undefined ? importedData.type : prev.type,
                        contents: formattedContents,
                        isPrivate: importedData.isPrivate !== undefined ? importedData.isPrivate : prev.isPrivate,
                        photo: importedData.photo !== undefined ? importedData.photo : prev.photo,
                    }));

                    console.log("Данные успешно импортированы:", importedData);
                    setError(null);

                } catch (err: any) {
                    console.error("Не удалось импортировать JSON:", err);
                    setError(`Ошибка импорта: ${err.message}`);
                } finally {
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }
            };
            reader.onerror = () => {
                setError("Не удалось прочитать выбранный файл.");
                if (fileInputRef.current) fileInputRef.current.value = "";
            };
            reader.readAsText(file);
        },

        handleExportJson: () => {
            try {
                const exportData = {
                    name: formData.name,
                    description: formData.description,
                    type: formData.type,
                    contents: formData.contents,
                    isPrivate: formData.isPrivate,
                    photo: formData.photo,
                };

                const jsonString = JSON.stringify(exportData, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const fileName = `${formData.name?.replace(/[^a-z0-9а-яё]/gi, '_').toLowerCase() || 'custom_item'}.json`;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                console.log("Данные экспортированы в JSON:", fileName);
                setError(null);
            } catch (err) {
                console.error("Не удалось экспортировать JSON:", err);
                setError("Не удалось сгенерировать JSON для экспорта.");
            }
        },

        handleSave: async () => {
            console.log("Сохранение нового пресета:", formData);
            const newId = await createCustomItem(formData.type, formData);
            // Consider adding navigation or feedback after save
            // Example: router.push(`/items/${formData.type}/${newId}`);
        },

        handleUpdate: async () => {
            if (!formData._id) {
                setError("Невозможно обновить: отсутствует ID элемента.");
                return;
            }
            console.log("Обновление пресета", formData._id, formData);
            setUpdateStatus('updating');
            setError(null);

            try {
                await updateCustomItem(formData.type, formData, formData._id);
                console.log("Пресет успешно обновлен.");
                setUpdateStatus('success');

                setTimeout(() => {
                    setUpdateStatus('idle');
                }, 2500);

            } catch (err: any) {
                console.error("Ошибка при обновлении пресета:", err);
                setError(`Ошибка обновления: ${err.message || 'Неизвестная ошибка'}`);
                setUpdateStatus('error');
            }
        }
    }


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

            try {
                const paramsData = (await params)?.id
                const hasValidParams = paramsData && paramsData.length >= 2 && paramsData[0] && paramsData[1]

                if (hasValidParams) {
                    const itemData = await getCustomItem(paramsData[0] as any, paramsData[1])
                    if (itemData && itemData.item) {
                        let formattedContents = itemData.item.contents;
                        if (itemData.item.type === 'history' && typeof formattedContents === 'string') {
                            try {
                                formattedContents = JSON.parse(formattedContents);
                                if (!Array.isArray(formattedContents)) formattedContents = [];
                            } catch {
                                formattedContents = [];
                            }
                        } else if (itemData.item.type !== 'history' && Array.isArray(formattedContents)) {
                            formattedContents = JSON.stringify(formattedContents, null, 2);
                        }

                        setFormData({ ...itemData.item, contents: formattedContents })
                        setAuthorName(itemData.authorName)
                        setIsLiked(itemData.isLiked)
                        setViewMode(itemData.isEditable ? 'edit' : 'view')
                    } else {
                        console.log("Элемент не найден, переход в режим создания.");
                        setViewMode('create')
                        setFormData(initialFormData)
                    }
                } else {
                    setViewMode('create')
                    setFormData(initialFormData)
                }
            } catch (err: any) {
                console.error("Не удалось обработать элемент:", err)
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
        if (updateStatus === 'success') return null;
        return <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">{error}</div>
    }

    const isEditable = viewMode === 'edit' || viewMode === 'create'

    const renderContentArea = () => {
        switch (formData.type) {
            case 'history':
                const historyMessages = Array.isArray(formData.contents) ? formData.contents : [];
                return (
                    <div className="flex flex-col h-full">
                        <h2 className="text-xl font-semibold mb-3 border-b pb-2">История чата</h2>
                        <div className="flex-grow overflow-y-auto border border-gray-200 p-4 rounded-xl bg-gray-50 space-y-3 mb-4">
                            {historyMessages.map((content: any, index: number) => (
                                <div
                                    key={index}
                                    className={`py-2 px-4 rounded-t-xl max-w-[80%] break-words shadow-sm ${content.role === 'user'
                                        ? 'bg-blue-100 ml-auto rounded-bl-xl text-right'
                                        : 'bg-gray-100 mr-auto rounded-br-xl'
                                        }`}
                                >
                                    <strong className="block mb-1 text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        {content.role === 'user' ? 'Пользователь' : 'Модель'}:
                                    </strong>
                                    {content.parts && content.parts.length > 0 && (
                                        <p className="m-0 text-sm">{content.parts[0].text}</p>
                                    )}
                                </div>
                            ))}
                            {historyMessages.length === 0 && !isEditable && (
                                <p className="text-gray-400 text-center italic py-4">Нет сообщений в истории.</p>
                            )}
                            {historyMessages.length === 0 && isEditable && (
                                <p className="text-gray-400 text-center italic py-4">Начните разговор ниже.</p>
                            )}
                        </div>
                        {isEditable && (
                            <div className="mt-auto flex items-center gap-3">
                                <select
                                    value={newMessageRole}
                                    onChange={(e) => setNewMessageRole(e.target.value as 'user' | 'model')}
                                    className="p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-1 focus:ring-[#7242f5] focus:border-[#7242f5] outline-none"
                                    disabled={updateStatus === 'updating'}
                                >
                                    <option value="user">Пользователь</option>
                                    <option value="model">Модель</option>
                                </select>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Введите ваше сообщение..."
                                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7242f5] focus:border-[#7242f5] outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && handlers.handleAddMessage()}
                                    disabled={updateStatus === 'updating'}
                                />
                                <button
                                    onClick={handlers.handleAddMessage}
                                    style={{ backgroundColor: FUNCTIONAL_COLOR }}
                                    className={`px-5 py-2 text-white rounded-lg transition-opacity ${updateStatus === 'updating'
                                            ? 'opacity-70 cursor-not-allowed'
                                            : 'hover:opacity-90'
                                        }`}
                                    disabled={updateStatus === 'updating'}
                                >
                                    Отправить
                                </button>
                            </div>
                        )}
                    </div>
                )
            case 'prompt':
            case 'systemPrompt':
                const placeholderText = `Введите текст ${formData.type === 'prompt' ? 'запроса' : 'системного запроса'} здесь...`;
                const displayContent = typeof formData.contents === 'string' ? formData.contents : JSON.stringify(formData.contents, null, 2);
                return (
                    <div className="flex flex-col h-full">
                        <h2 className="text-xl font-semibold mb-3 border-b pb-2">
                            {formData.type === 'prompt' ? 'Запрос' : 'Системный запрос'}
                        </h2>
                        {isEditable ? (
                            <textarea
                                name="contents"
                                value={displayContent}
                                onChange={handlers.handleInputChange}
                                className="flex-grow p-3 border border-gray-300 rounded-xl bg-gray-50 font-mono text-sm whitespace-pre-wrap break-words focus:ring-1 focus:ring-[#7242f5] focus:border-[#7242f5] outline-none"
                                placeholder={placeholderText}
                                disabled={updateStatus === 'updating'}
                            />
                        ) : (
                            <pre className="flex-grow p-3 border border-gray-200 rounded-xl bg-gray-50 font-mono text-sm whitespace-pre-wrap break-words overflow-y-auto">
                                {displayContent || (viewMode === 'view' ? <span className="italic text-gray-400">Содержимое отсутствует.</span> : '')}
                            </pre>
                        )}
                    </div>
                )
            default:
                return <p>Выбран неизвестный тип содержимого.</p>
        }
    }


    return (
        <div className="h-screen flex font-sans antialiased">
            <div className="w-1/3 max-w-md h-full p-6 border-r border-gray-200 overflow-y-auto bg-white shadow-lg flex flex-col gap-5">
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
                        </select>
                    ) : (
                        <p className="text-gray-700 capitalize p-2 bg-gray-50 rounded-lg">
                            {formData.type === 'prompt' ? 'Запрос' : formData.type === 'systemPrompt' ? 'Системный запрос' : 'История'}
                        </p>
                    )}
                </div>

                {isEditable && (
                    <div className="flex gap-3">
                        <label
                            htmlFor="import-json-button"
                            className={`flex-1 px-4 py-2 text-center bg-gray-100 text-gray-700 rounded-lg border border-gray-300 text-sm transition-colors ${updateStatus === 'updating'
                                    ? 'opacity-70 cursor-not-allowed'
                                    : 'hover:bg-gray-200 cursor-pointer'
                                }`}
                        >
                            Импорт JSON
                        </label>
                        <input
                            id="import-json-button"
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handlers.handleFileImport}
                            className="hidden"
                            disabled={updateStatus === 'updating'}
                        />
                        <button
                            onClick={handlers.handleExportJson}
                            className={`flex-1 px-4 py-2 text-center bg-gray-100 text-gray-700 rounded-lg border border-gray-300 text-sm transition-colors ${updateStatus === 'updating'
                                    ? 'opacity-70 cursor-not-allowed'
                                    : 'hover:bg-gray-200 cursor-pointer'
                                }`}
                            title="Скачать текущие данные в формате JSON (исключая внутренние ID, лайки)"
                            disabled={updateStatus === 'updating'}
                        >
                            Экспорт JSON
                        </button>
                    </div>
                )}


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
                        >
                            Сохранить новый пресет
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
                        <>
                            <button
                                onClick={handlers.handleExportJson}
                                className="w-full px-4 py-2 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer border border-gray-300 text-sm transition-colors mb-3"
                                title="Скачать данные пресета в формате JSON"
                            >
                                Экспорт JSON
                            </button>
                            <p className="text-center text-gray-500 italic text-sm">Режим просмотра. Редактирование запрещено.</p>
                        </>
                    )}
                </div>
            </div>

            <div className="w-2/3 h-full p-6 bg-gray-50 flex flex-col">
                {renderContentArea()}
            </div>
        </div>
    )
}