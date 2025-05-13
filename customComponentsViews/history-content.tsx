import React from 'react';

interface HistoryContentProps {
    contents: any;
    isEditable: boolean;
    newMessage: string;
    setNewMessage: (msg: string) => void;
    newMessageRole: 'user' | 'model';
    setNewMessageRole: (role: 'user' | 'model') => void;
    handleAddMessage: () => void;
    updateStatus: 'idle' | 'updating' | 'success' | 'error';
}

const FUNCTIONAL_COLOR = '#7242f5';

const HistoryContent: React.FC<HistoryContentProps> = ({
    contents,
    isEditable,
    newMessage,
    setNewMessage,
    newMessageRole,
    setNewMessageRole,
    handleAddMessage,
    updateStatus
}) => {
    const historyMessages = Array.isArray(contents) ? contents : [];

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
                        onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
                        disabled={updateStatus === 'updating'}
                    />
                    <button
                        onClick={handleAddMessage}
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
    );
};

export default HistoryContent;