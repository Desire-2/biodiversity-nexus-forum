import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-zoom';

const Dashboard = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'New Users',
        data: data.newUsers,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default Dashboard;
