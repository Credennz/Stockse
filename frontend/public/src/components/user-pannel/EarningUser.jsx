import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const EarningUser = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Reinvested",
              data: [30, 25, 20, 35, 45, 35, 85, 45, 65, 35, 55, 20],
              fill: true,
              backgroundColor: "rgba(255, 159, 139, 0.7)",
              borderColor: "rgba(255, 159, 139, 1)",
              tension: 0.4,
              pointHitRadius: 10,
              pointHoverRadius: 8,
            },
            {
              label: "Withdrawn/Month",
              data: [65, 35, 30, 40, 35, 45, 55, 40, 35, 45, 85, 35],
              fill: true,
              backgroundColor: "rgba(187, 159, 255, 0.7)",
              borderColor: "rgba(187, 159, 255, 1)",
              tension: 0.4,
              pointHitRadius: 10,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20,
              },
              grid: {
                color: "#f0f0f0",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
          elements: {
            point: {
              radius: 0,
            },
          },
        },
      });
    }
  }, []);

  return (
    <div className="mpcontainer">
      <div className="mpheader">
        <div>
          <div className="title">Earning Preview</div>
          <div className="subtitle">Preview calculation with analytics</div>
        </div>
        <select className="dropdown">
          <option>Till Date</option>
          <option>Till Month</option>
        </select>
      </div>
      <div className="chart-container">
        <canvas ref={chartRef} id="earningChart"></canvas>
      </div>
    </div>
  );
};

export default EarningUser;