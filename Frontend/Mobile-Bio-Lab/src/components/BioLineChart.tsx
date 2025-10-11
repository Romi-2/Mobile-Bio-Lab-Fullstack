// // frontend/src/components/BioLineChart.tsx
// import React from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// export interface BioDataPoint {
//   date: string;
//   value: number;
// }

// interface BioLineChartProps {
//   data: BioDataPoint[];
// }

// const BioLineChart: React.FC<BioLineChartProps> = ({ data }) => {
//   const chartData = {
//     labels: data.map((item) => item.date),
//     datasets: [
//       {
//         label: "Sample Measurement",
//         data: data.map((item) => item.value),
//         borderColor: "rgba(75,192,192,1)",
//         backgroundColor: "rgba(75,192,192,0.2)",
//         tension: 0.4,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" as const },
//       tooltip: { mode: "index" as const, intersect: false },
//     },
//     interaction: { mode: "nearest" as const, axis: "x" as const, intersect: false },
//   };

//   return <Line data={chartData} options={options} />;
// };

// export default BioLineChart;
