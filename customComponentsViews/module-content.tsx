import React from 'react';

interface ModuleContentProps {
    contents: any;
    isEditable: boolean;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    updateStatus: 'idle' | 'updating' | 'success' | 'error';
}

interface InputOutputItem {
    id: string;
    name: string;
    type: string;
}

const ITEM_TYPES = ['text', 'png', 'mp3'];

const ModuleContent: React.FC<ModuleContentProps> = ({
    contents,
    isEditable,
    setFormData,
    updateStatus
}) => {
    const moduleContents = contents || { name: '', endpoint: '', inputs: [], outputs: [] };

    const handleContentChange = (fieldName: string, value: any) => {
        if (updateStatus === 'success' || updateStatus === 'error') {
            setFormData((prev: any) => ({ ...prev, updateStatus: 'idle' }));
        }
        setFormData((prev: any) => ({
            ...prev,
            contents: {
                ...prev.contents,
                [fieldName]: value,
            },
        }));
    };

    const handleArrayItemChange = (arrayName: 'inputs' | 'outputs', index: number, fieldName: string, value: string) => {
        if (updateStatus === 'success' || updateStatus === 'error') {
            setFormData((prev: any) => ({ ...prev, updateStatus: 'idle' }));
        }
        setFormData((prev: any) => {
            const updatedArray = [...(prev.contents[arrayName] || [])];
            if (!updatedArray[index]) { 
                updatedArray[index] = { id: '', name: '', type: '' };
            }
            updatedArray[index] = {
                ...updatedArray[index],
                [fieldName]: value,
            };
            return {
                ...prev,
                contents: {
                    ...prev.contents,
                    [arrayName]: updatedArray,
                },
            };
        });
    };

    const handleAddItem = (arrayName: 'inputs' | 'outputs') => {
        if (updateStatus === 'success' || updateStatus === 'error') {
            setFormData((prev: any) => ({ ...prev, updateStatus: 'idle' }));
        }
        const currentArray = Array.isArray(moduleContents[arrayName]) ? moduleContents[arrayName] : [];
        setFormData((prev: any) => ({
            ...prev,
            contents: {
                ...prev.contents,
                [arrayName]: [
                    ...(prev.contents[arrayName] || []),
                    { id: Date.now().toString() + (currentArray.length), name: '', type: ITEM_TYPES[0] || '' },
                ],
            },
        }));
    };

    const handleRemoveItem = (arrayName: 'inputs' | 'outputs', index: number) => {
        if (updateStatus === 'success' || updateStatus === 'error') {
            setFormData((prev: any) => ({ ...prev, updateStatus: 'idle' }));
        }
        setFormData((prev: any) => ({
            ...prev,
            contents: {
                ...prev.contents,
                [arrayName]: (prev.contents[arrayName] || []).filter((_: any, i: number) => i !== index),
            },
        }));
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Модуль</h2>

            <div className="space-y-6 flex-grow overflow-y-auto pr-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{'Название ноды модуля (должно быть кратким и понятным)'}</label>
                    {isEditable ? (
                        <input
                            type="text"
                            value={moduleContents.name || ''}
                            onChange={(e) => handleContentChange('name', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7242f5] focus:border-[#7242f5] outline-none"
                            disabled={updateStatus === 'updating'}
                        />
                    ) : (
                        <p className="text-gray-800 p-2 bg-gray-50 rounded-lg">{moduleContents.name || <span className="italic text-gray-400">Не указано</span>}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Эндпоинт (URL)</label>
                    {isEditable ? (
                        <input
                            type="text"
                            value={moduleContents.endpoint || ''}
                            onChange={(e) => handleContentChange('endpoint', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7242f5] focus:border-[#7242f5] outline-none font-mono text-sm"
                            placeholder="Например: /api/my-module"
                            disabled={updateStatus === 'updating'}
                        />
                    ) : (
                        <p className="text-gray-800 p-2 bg-gray-50 rounded-lg font-mono text-sm">{moduleContents.endpoint || <span className="italic text-gray-400">Не указан</span>}</p>
                    )}
                </div>

                <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 pb-1 border-b">Входы</h3>
                    <ul className="space-y-3">
                        {(Array.isArray(moduleContents.inputs) ? moduleContents.inputs : []).map((input: InputOutputItem, index: number) => (
                            <li key={input.id || `input-${index}`} className="flex flex-col sm:flex-row items-center gap-3 p-3 border border-gray-200 rounded-md bg-gray-50 text-sm">
                                {isEditable ? (
                                    <>
                                        <input
                                            type="text"
                                            value={input.name}
                                            onChange={(e) => handleArrayItemChange('inputs', index, 'name', e.target.value)}
                                            placeholder="Название входа"
                                            className="flex-1 w-full sm:w-auto p-1.5 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-[#7242f5] text-gray-800"
                                            disabled={updateStatus === 'updating'}
                                        />
                                        <select
                                            value={input.type}
                                            onChange={(e) => handleArrayItemChange('inputs', index, 'type', e.target.value)}
                                            className="w-full sm:w-24 p-1.5 border border-gray-300 rounded bg-white outline-none focus:ring-1 focus:ring-[#7242f5] text-gray-700"
                                            disabled={updateStatus === 'updating'}
                                        >
                                            {ITEM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                        <button
                                            onClick={() => handleRemoveItem('inputs', index)}
                                            className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors"
                                            disabled={updateStatus === 'updating'}
                                        >
                                            × Удалить
                                        </button>
                                    </>
                                ) : (
                                    <span className="flex-1 w-full text-gray-700">{input.name} (<strong className="font-medium">{input.type}</strong>)</span>
                                )}
                            </li>
                        ))}
                        {(Array.isArray(moduleContents.inputs) ? moduleContents.inputs : []).length === 0 && !isEditable && (
                            <p className="text-gray-400 italic text-center py-2">Нет определенных входов.</p>
                        )}
                    </ul>
                    {isEditable && (
                        <button
                            onClick={() => handleAddItem('inputs')}
                            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                            disabled={updateStatus === 'updating'}
                        >
                            + Добавить Вход
                        </button>
                    )}
                </div>

                <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 pb-1 border-b">Выходы</h3>
                    <ul className="space-y-3">
                        {(Array.isArray(moduleContents.outputs) ? moduleContents.outputs : []).map((output: InputOutputItem, index: number) => (
                            <li key={output.id || `output-${index}`} className="flex flex-col sm:flex-row items-center gap-3 p-3 border border-gray-200 rounded-md bg-gray-50 text-sm">
                                {isEditable ? (
                                    <>
                                        <input
                                            type="text"
                                            value={output.name}
                                            onChange={(e) => handleArrayItemChange('outputs', index, 'name', e.target.value)}
                                            placeholder="Название выхода"
                                            className="flex-1 w-full sm:w-auto p-1.5 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-[#7242f5] text-gray-800"
                                            disabled={updateStatus === 'updating'}
                                        />
                                        <select
                                            value={output.type}
                                            onChange={(e) => handleArrayItemChange('outputs', index, 'type', e.target.value)}
                                            className="w-full sm:w-24 p-1.5 border border-gray-300 rounded bg-white outline-none focus:ring-1 focus:ring-[#7242f5] text-gray-700"
                                            disabled={updateStatus === 'updating'}
                                        >
                                            {ITEM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                        <button
                                            onClick={() => handleRemoveItem('outputs', index)}
                                            className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors"
                                            disabled={updateStatus === 'updating'}
                                        >
                                            × Удалить
                                        </button>
                                    </>
                                ) : (
                                    <span className="flex-1 w-full text-gray-700">{output.name} (<strong className="font-medium">{output.type}</strong>)</span>
                                )}
                            </li>
                        ))}
                        {(Array.isArray(moduleContents.outputs) ? moduleContents.outputs : []).length === 0 && !isEditable && (
                            <p className="text-gray-400 italic text-center py-2">Нет определенных выходов.</p>
                        )}
                    </ul>
                    {isEditable && (
                        <button
                            onClick={() => handleAddItem('outputs')}
                            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                            disabled={updateStatus === 'updating'}
                        >
                            + Добавить Выход
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ModuleContent;