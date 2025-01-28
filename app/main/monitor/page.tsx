'use client'
import { Chart } from "react-google-charts";



export default function ChartPage() {
    return (
        <div>
            <Chart
                chartType="ScatterChart"
                data={[
                    ["Age", "Weight"],
                    [4, 16],
                    [8, 25],
                    [12, 40],
                    [16, 55],
                    [20, 70],
                ]}
                options={{
                    title: "Average Weight by Age",
                }}
                legendToggle
            />
        </div>
    );
}
