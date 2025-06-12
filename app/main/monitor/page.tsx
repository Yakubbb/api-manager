'use client'
import { getUserPathsStats, PathStatistics } from "@/server-side/statistics-handler";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

export default function ChartPage() {
    const [pathsData, setPathsData] = useState<PathStatistics[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getUserPathsStats();
                setPathsData(data);
            } catch (err: any) {
                console.error("Failed to fetch path statistics:", err);
                setError("Не удалось загрузить статистику маршрутов: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg">Загрузка статистики...</div>;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-600 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Ошибка!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    if (pathsData.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                <p>Нет доступных данных по маршрутам.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 flex flex-col h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Статистика маршрутов</h1>

            <div className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pathsData.map((path) => (
                        <div key={path.id} className="bg-white rounded-2xl shadow-xl p-4 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                            <h2 className="text-lg font-semibold mb-3 text-gray-700 break-words">{path.name}</h2>
                            <div className="space-y-3">
                                
                                <div className="mb-3">
                                    <h3 className="text-md font-medium text-gray-600 mb-1 font-main2">Использований</h3>
                                    <Chart
                                        chartType="ColumnChart"
                                        width="100%"
                                        height="100px"
                                        data={[["Маршрут", "Количество"], [path.name, path.usesCount]]}
                                        options={{
                                            title: ``,
                                            legend: { position: "none" },
                                            vAxis: { minValue: 0, format: '0' },
                                            colors: ['#7242f5'],
                                            chartArea: { width: '80%', height: '70%' }
                                        }}
                                    />
                                    <p className="text-center text-gray-500 text-sm">Всего: {path.usesCount}</p>
                                </div>

                                
                                <div className="mb-3">
                                    <h3 className="text-md font-medium text-gray-600 mb-1">Уникальные пользователи</h3>
                                    <Chart
                                        chartType="PieChart"
                                        width="100%"
                                        height="130px"
                                        data={[
                                            ["Тип", "Количество"],
                                            ["Уникальные", path.uniqueUsers.length],
                                            ["Повторные (для визуализации)", path.usesCount - path.uniqueUsers.length > 0 ? path.usesCount - path.uniqueUsers.length : 0]
                                        ]}
                                        options={{
                                            title: '',
                                            pieHole: 0.4,
                                            colors: ['#7242f5', '#FADB14'],
                                            legend: { position: 'bottom', alignment: 'center', textStyle: { fontSize: 10 } },
                                            chartArea: { width: '90%', height: '80%' },
                                            tooltip: { trigger: 'focus' }
                                        }}
                                    />
                                    <p className="text-center text-gray-500 text-sm">Всего уникальных: {path.uniqueUsers.length}</p>
                                </div>

                                
                                <div>
                                    <h3 className="text-md font-medium text-gray-600 mb-1">Ошибки</h3>
                                    {path.errors && path.errors.length > 0 ? (
                                        <>
                                            <Chart
                                                chartType="BarChart"
                                                width="100%"
                                                height="100px"
                                                data={[["Тип ошибки", "Количество"], ...Object.entries(path.errors.reduce((acc: { [key: string]: number }, error) => {
                                                    acc[error] = (acc[error] || 0) + 1;
                                                    return acc;
                                                }, {}))]}
                                                options={{
                                                    title: '',
                                                    legend: { position: "none" },
                                                    hAxis: { minValue: 0, format: '0' },
                                                    colors: ['#EA4335'],
                                                    chartArea: { width: '80%', height: '70%' },
                                                    animation: {
                                                        startup: true,
                                                        duration: 1000,
                                                        easing: 'out',
                                                    },
                                                    tooltip: { trigger: 'focus' }
                                                }}
                                            />
                                            <p className="text-center text-gray-500 text-sm">Всего ошибок: {path.errors.length}</p>
                                        </>
                                    ) : (
                                        <p className="text-gray-500 text-center italic text-sm">Ошибок не зафиксировано.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}