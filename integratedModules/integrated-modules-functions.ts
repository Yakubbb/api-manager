
import { getAnswer } from "@/server-side/gemini"
import { getFetch } from "./serverFetches"

export const MODULES_FUNCTIONS: { id: string, function: (args: { id: string, value?: any }[]) => Promise<{ id: string, value?: any }[]> }[] = [
    {
        id: '6813d916205011b75f19a391',
        function: async (arg) => {
            const model = arg.find(a => a.id == 'geminiModel')
            const prompt = arg.find(a => a.id == 'prompt')
            const sysprompt = arg.find(a => a.id == 'systemPrompt')
            const history = arg.find(a => a.id == 'history')
            const config = arg.find(a => a.id == 'mimeType')

            if (model && prompt) {
                return [{ id: 'answer', value: await getAnswer(model.value, prompt.value, history?.value, sysprompt?.value, config?.value) }]
            }
            return [
                { id: 'answer', value: 'укажите модель и промпт' }
            ]
        }
    },
    {
        id: '6813fba8099eb688eb137c4e',
        function: async (arg) => {
            const searchTerm = arg.find(a => a.id == 'imageName')?.value;

            if (!searchTerm) {
                return [{ id: 'imageUrl', value: 'Не указан поисковый запрос' }];
            }
            try {
                const response = await getFetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(searchTerm)}&iax=images&ia=images&format=json`);
                console.log('тоже оно', response)
                const data = await response;
                if (data.Results && data.Results.length > 0) {
                    console.log('это оно', data.Results)
                    return [{ id: 'imageUrl', value: `https://duckduckgo.com${data.Image}` }];
                } else {
                    return [{ id: 'imageUrl', value: 'Изображение не найдено' }];
                }
            } catch (error) {
                console.error("Ошибка поиска изображения:", error);
                return [{ id: 'imageUrl', value: 'Ошибка при поиске изображения' }];
            }
        }
    }
]