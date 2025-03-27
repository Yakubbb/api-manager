'use client'

import { getCustomItem } from "@/server-side/custom-items-database-handler"
import { useEffect, useState } from "react"

const initialFormData = {
    _id: null,
    name: '',
    description: '',
    type: 'prompt', // Default type for creation
    contents: '', // String for prompt, array for history
    isPrivate: false,
    photo: '', // Assuming photo is a URL string
    likes: [],
    authorId: null, // Will be set on server during save
}

export default function ({ params }: { params: Promise<{ id: string[] }> }) {

    const [viewMode, setViewMode] = useState('loading') // 'loading', 'error', 'view', 'edit', 'create'
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState<any>(initialFormData)
    const [authorName, setAuthorName] = useState<string | null>(null)
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [newMessage, setNewMessage] = useState<string>('')

    useEffect(() => {
        const getParamsAndFetch = async () => {
            setViewMode('loading')
            setError(null)
            setFormData(initialFormData) // Reset form data on param change
            setAuthorName(null)
            setIsLiked(false)

            try {
                const paramsData = (await params)?.id
                const hasValidParams = paramsData && paramsData.length >= 2 && paramsData[0] && paramsData[1]

                if (hasValidParams) {
                    const itemData = await getCustomItem(paramsData[0] as any, paramsData[1])
                    if (itemData && itemData.item) {
                        setFormData({ ...itemData.item }) // Load fetched item data
                        setAuthorName(itemData.authorName)
                        setIsLiked(itemData.isLiked)
                        setViewMode(itemData.isEditable ? 'edit' : 'view')
                    } else {
                        // Item not found, allow creation
                        setViewMode('create')
                        setFormData(initialFormData) // Start with clean slate
                    }
                } else {
                    // No valid params, assume creation mode
                    setViewMode('create')
                    setFormData(initialFormData)
                }
            } catch (err) {
                console.error("Failed to process item:", err)
                setError("Failed to load or initialize data.")
                setViewMode('error')
            }
        }
        getParamsAndFetch()
    }, [params])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked

        setFormData((prev: any) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
        console.log(`Updated ${name}:`, type === 'checkbox' ? checked : value)
    }

    const handleHistoryTypeContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
         // In create mode, allow editing initial history structure if needed (e.g., paste JSON)
        setFormData((prev: any) => ({
            ...prev,
            contents: e.target.value, // Store as string temporarily maybe? Or parse JSON? Let's stick to adding messages for now.
        }))
         console.log(`Updated history content (raw):`, e.target.value) // Less useful unless parsing
    }


    const handleAddMessage = () => {
        if (!newMessage.trim()) return

        const message = {
            role: 'user', // Assuming user is adding message in edit/create mode
            parts: [{ text: newMessage.trim() }],
        }

        setFormData((prev: any) => {
             // Ensure contents is an array for history
             const currentContents = Array.isArray(prev.contents) ? prev.contents : []
             return {
                 ...prev,
                 contents: [...currentContents, message],
             }
         })

        console.log("Adding message:", message)
        setNewMessage('') // Clear input field
    }

    const handleSave = () => {
        console.log("Saving new item:", formData)
        // Add actual save logic here (e.g., API call)
        alert("Save action triggered (see console). Implement actual save logic.")
    }

     const handleUpdate = () => {
        console.log("Updating item:", formData._id, formData)
        // Add actual update logic here (e.g., API call)
        alert("Update action triggered (see console). Implement actual update logic.")
    }


    if (viewMode === 'loading') {
        return <div className="h-screen flex items-center justify-center">Loading...</div>
    }

    if (viewMode === 'error') {
        return <div className="h-screen flex items-center justify-center text-red-600">Error: {error}</div>
    }

    const isEditable = viewMode === 'edit' || viewMode === 'create'

    const renderContentArea = () => {
        switch (formData.type) {
            case 'history':
                const historyMessages = Array.isArray(formData.contents) ? formData.contents : [];
                return (
                    <div className="flex flex-col h-full">
                        <h2 className="text-xl font-semibold mb-3 border-b pb-2">Chat History</h2>
                        <div className="flex-grow overflow-y-auto border border-gray-200 p-2.5 rounded bg-gray-50 space-y-2.5 mb-4">
                            {historyMessages.map((content: any, index: number) => (
                                <div
                                    key={index}
                                    className={`py-2 px-3 rounded-2xl max-w-[80%] break-words ${
                                        content.role === 'user'
                                            ? 'bg-blue-100 ml-auto rounded-br-lg text-right'
                                            : 'bg-gray-100 mr-auto rounded-bl-lg'
                                    }`}
                                >
                                    <strong className="block mb-1 text-sm text-gray-500 font-semibold">
                                        {content.role === 'user' ? 'User' : 'Model'}:
                                    </strong>
                                    {content.parts && content.parts.length > 0 && (
                                        <p className="m-0 text-sm">{content.parts[0].text}</p>
                                    )}
                                </div>
                            ))}
                             {historyMessages.length === 0 && !isEditable && (
                                 <p className="text-gray-400 text-center">No history messages.</p>
                             )}
                             {historyMessages.length === 0 && isEditable && (
                                 <p className="text-gray-400 text-center">Start the conversation.</p>
                             )}
                        </div>
                        {isEditable && (
                            <div className="mt-auto flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-grow p-2 border border-gray-300 rounded"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
                                />
                                <button
                                    onClick={handleAddMessage}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Send
                                </button>
                            </div>
                        )}
                    </div>
                )
            case 'prompt':
            case 'systemPrompt':
                return (
                    <div className="flex flex-col h-full">
                         <h2 className="text-xl font-semibold mb-3 border-b pb-2">
                             {formData.type === 'prompt' ? 'Prompt' : 'System Prompt'}
                         </h2>
                         {isEditable ? (
                             <textarea
                                name="contents"
                                value={typeof formData.contents === 'string' ? formData.contents : JSON.stringify(formData.contents)} // Handle potential non-string content?
                                onChange={handleInputChange}
                                className="flex-grow p-2 border border-gray-300 rounded bg-gray-50 font-mono text-sm whitespace-pre-wrap break-words"
                                placeholder={`Enter ${formData.type === 'prompt' ? 'prompt' : 'system prompt'} text here...`}
                             />
                         ) : (
                             <pre className="flex-grow p-2 border border-gray-200 rounded bg-gray-50 font-mono text-sm whitespace-pre-wrap break-words overflow-y-auto">
                                {formData.contents || (viewMode === 'view' ? 'No content.' : '')}
                             </pre>
                         )}
                     </div>
                )
            default:
                return <p>Unknown content type.</p>
        }
    }


    return (
        <div className="h-screen flex font-sans">
            {/* Left Panel: Details */}
            <div className="w-1/3 h-full p-5 border-r border-gray-300 overflow-y-auto bg-white shadow-md flex flex-col gap-4">
                <h1 className="text-2xl font-bold mb-3 border-b pb-2">
                    {viewMode === 'create' ? 'Create New Item' : 'Item Details'}
                </h1>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    {isEditable ? (
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    ) : (
                        <p className="text-gray-800">{formData.name || 'N/A'}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    {isEditable ? (
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    ) : (
                        <p className="text-gray-600 whitespace-pre-wrap break-words">{formData.description || 'N/A'}</p>
                    )}
                </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    {isEditable ? (
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                        >
                            <option value="prompt">Prompt</option>
                            <option value="systemPrompt">System Prompt</option>
                            <option value="history">History</option>
                        </select>
                    ) : (
                        <p className="text-gray-600 capitalize">{formData.type}</p>
                    )}
                </div>

                {isEditable && (
                     <div className="flex items-center gap-2">
                         <input
                            type="checkbox"
                            id="isPrivate"
                            name="isPrivate"
                            checked={formData.isPrivate}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                         />
                         <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">
                            Private
                         </label>
                     </div>
                )}

                {viewMode !== 'create' && (
                     <>
                         <hr className="my-2"/>
                         <p className="text-sm text-gray-600">
                            <strong className="text-black font-semibold">Author:</strong> {authorName || 'Unknown'}
                         </p>
                         <p className="text-sm text-gray-600">
                            <strong className="text-black font-semibold">Likes:</strong> {formData.likes?.length || 0}
                         </p>
                         <p className="text-sm text-gray-600">
                            <strong className="text-black font-semibold">Liked by you:</strong> {isLiked ? 'Yes' : 'No'}
                         </p>
                         {formData.photo && (
                            <div>
                                <strong className="text-black font-semibold block mb-1 text-sm">Photo:</strong>
                                <img
                                    src={formData.photo}
                                    alt={formData.name}
                                    className="max-w-[100px] max-h-[100px] rounded mt-1 border"
                                />
                            </div>
                         )}
                     </>
                )}


                 {/* Action Buttons */}
                 <div className="mt-auto pt-4 border-t">
                     {viewMode === 'create' && (
                        <button
                            onClick={handleSave}
                            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Save New Item
                        </button>
                     )}
                     {viewMode === 'edit' && (
                        <button
                            onClick={handleUpdate}
                            className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                            Update Item
                        </button>
                     )}
                 </div>


            </div>

            {/* Right Panel: Content */}
            <div className="w-2/3 h-full p-5 bg-gray-50 flex flex-col">
               {renderContentArea()}
            </div>
        </div>
    )
}