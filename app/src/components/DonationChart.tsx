import { FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Legend
);
ChartJS.defaults.color = "#DDDDDD";
const options = {
  responsive: true,
  aspectRatio: 1,
  scales: {
    y: {
      title: {
        display: true,
        text: "Matched",
        min: 0,
      },
    },
    x: {
      title: {
        display: true,
        text: "Donated",
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Matching Donation",
    },
  },
};

export const DonationChart: FC<{
  donation: number;
  matchRatio: (x: number) => number;

  /** A normal expected donation, if the donation is higher than this, the graph will adapt the scale */
  stdDonation?: number;

  /** A percentage of the stdDonation that is always going to be blank */
  margin?: number;
}> = (props) => {
  let gradient: { addColorStop: (arg0: number, arg1: string) => void } =
    undefined;

  function getGradient(context) {
    const chart = context.chart;
    const { ctx, chartArea } = chart;

    if (!chartArea) {
      // This case happens on initial chart load
      return;
    }
    if (!gradient) {
      // Create the gradient because this is either the first render
      // or the size of the chart has changed
      gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
      );
      gradient.addColorStop(0, "#9945FF70");
      gradient.addColorStop(1, "#14F195");
    }

    return gradient;
  }

  const marginRatio = 1 + (props.margin ?? 0.2);
  const stdDonation = props.stdDonation ?? 1;
  const scaleBase = props.donation < stdDonation ? stdDonation : props.donation;
  const resolution = 10;
  const step = (scaleBase * marginRatio) / resolution;
  const labels = Array.from(
    { length: props.donation > 0 ? resolution : 1 },
    (_, i) => Math.round((Number.EPSILON + i * step) * 100) / 100
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Matched",
        fill: "start",
        data: labels.map((x) =>
          x <= props.donation && props.donation > 0 ? props.matchRatio(x) : NaN
        ),
        borderColor: getGradient,
        backgroundColor: getGradient,
        tension: 0.5,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="max-w-sm aspect-square text-slate-300">
      <Line options={options} data={data} />
    </div>
  );
};
