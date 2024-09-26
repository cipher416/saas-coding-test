import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PriceHistoryEntry {
  price: number;
  timestamp: string;
}

type PriceHistoryChartProps = {
  customerId: number,
  productId: number
}

type LocaleMapping = {
  locale: string,
  timeZone: string
}

const currencyLocaleMap: Record<string, LocaleMapping> = {
    SGD: {
        locale: 'en-SG',  // Singapore
        timeZone: 'Asia/Singapore',
    },
    IDR: {
        locale: 'id-ID',  // Indonesia
        timeZone: 'Asia/Jakarta',
    },
    HKD: {
        locale: 'zh-HK',  // Hong Kong
        timeZone: 'Asia/Hong_Kong',
    },
    USD: {
        locale: 'en-US',  // United States
        timeZone: 'America/New_York', // or other US time zones like America/Los_Angeles
    }
};


const PriceHistoryChart = ({customerId, productId}: PriceHistoryChartProps) => {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
  const [currency, setCurrency] = useState<string>('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await fetch(`/api/price-history/${productId}/${customerId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPriceHistory(data.price_history);
        setCurrency(data.currency)
      } catch (error) {
        console.error('Error fetching price history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [productId, customerId, currency]);


  const data = {
    labels: priceHistory.map((entry) => new Date(entry.timestamp).toLocaleDateString(currencyLocaleMap[currency].locale, {
      timeZone: currencyLocaleMap[currency].timeZone,
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      timeZoneName: "shortOffset"
      }), ),
    datasets: [
      {
        label: 'Price History',
        data: priceHistory.map((entry) => entry.price),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Price History Line Chart',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date and Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price',
        },
        beginAtZero: false,
        ticks: {
          callback: (value: number) => {
            return `${value} ${currency}`;
          },
        },
      },
    },
  };
  console.log(data)
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
};

export default PriceHistoryChart;
