import React from 'react';

interface PromptContentProps {
    contents: string | any;
    isEditable: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    updateStatus: 'idle' | 'updating' | 'success' | 'error';
}

const PromptContent: React.FC<PromptContentProps> = ({
    contents,
    isEditable,
    handleInputChange,
    updateStatus
}) => {
    const placeholderText = `Введите текст запроса здесь...`;
    const displayContent = typeof contents === 'string' ? contents : JSON.stringify(contents, null, 2);

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">Запрос</h2>
            {isEditable ? (
                <textarea
                    name="contents"
                    value={displayContent}
                    onChange={handleInputChange}
                    className="flex-grow p-3 border border-gray-300 rounded-xl bg-gray-50 font-mono text-sm whitespace-pre-wrap break-words focus:ring-1 focus:ring-[#7242f5] focus:border-[#7242f5] outline-none"
                    placeholder={placeholderText}
                    disabled={updateStatus === 'updating'}
                />
            ) : (
                <pre className="flex-grow p-3 border border-gray-200 rounded-xl bg-gray-50 font-mono text-sm whitespace-pre-wrap break-words overflow-y-auto">
                    {displayContent || <span className="italic text-gray-400">Содержимое отсутствует.</span>}
                </pre>
            )}
        </div>
    );
};

export default PromptContent;