import moment from 'moment';
// Mock data for PlantView components
export const plantName = "Sample Plant";

export const weatherData = {
  temperature: '24~32',
  status: 'Moderate rain',
  days: [
    { day: 'Wed', date: '2025-05-07' },
    { day: 'Thur', date: '' },
    { day: 'Fri', date: '' }
  ]
};

export const tabData = [
  {day:'daily'},
  {month:'monthly'},
  {year:'yearly'},
  {lifetime:'lifetime'},
]

export const samplePlantData = {
  stationInfo: [
    {
      station_name: "Time Dot Com",
      station_address: "MalaysiaShah AlamJalan Majistret U1/2614, Jalan Majistret U1/26",
      capacity: 6.5,
      grid_connection_date: "2025-01-25T00:00:00.000Z",
      day_power: 0.36,
      month_power: 159.39,
      total_power: 364.62
    }
  ],
  alarmCount: {
    total_alarm: "0",
    critical: "0",
    major: "0",
    minor: "0",
    warning: "0"
  },
  envBenefit: {
    coal_saved: 151.742,
    co2_avoided: 180.18400000000003,
    trees_planted: 246.1670000000001
  }
}; 

export const renderRevenueLineConfig = (graphData, period) => ({
  data: _.map(graphData, item => ({
    period: (
      period === 'lifetime' ? moment(item.period).format('YYYY') :
      period === 'monthly' ? moment(item.period).format('DD/MM/YYYY') :
      period === 'yearly' ? moment(item.period).format('MM/YYYY') :
      item.period
    ),
    "Power Profit": item.power_profit,
  })),
  xField: 'period',
  yField: 'Power Profit',
  height: 220,
  smooth: true,
  legend: false,
  animation: false,
  padding: [20, 20, 20, 40],
  color: '#4ECDC4',
  meta: {
    power_profit: { alias: 'Power Profit' },
    period: { alias: 'Date' },
  }
});

export const renderLineConfig = (graphData, period) => {
  // Transform the data to combine from_pv and total_consumption into a format suitable for two lines
  const transformedData = graphData.map(item => [
    {
      period: (
      period === 'lifetime' ? moment(item.period).format('YYYY') :
      period === 'monthly' ? moment(item.period).format('DD/MM/YYYY') :
      period === 'yearly' ? moment(item.period).format('MM/YYYY') :
      item.period
    ),
      value: item.from_pv,
      type: 'From PV',
      color: '#FF6B6B',
    },
    {
      period: (
      period === 'lifetime' ? moment(item.period).format('YYYY') :
      period === 'monthly' ? moment(item.period).format('DD/MM/YYYY') :
      period === 'yearly' ? moment(item.period).format('MM/YYYY') :
      item.period
    ),
      value: item.total_consumption,
      type: 'Total Consumption',
      color: '#4ECDC4',
    }
  ]).flat();

  return {
    data: transformedData,
    xField: 'period',
    yField: 'value',
    seriesField: 'type',
    height: 220,
    smooth: true,
    xAxis: {
      label: {
        style: { fontSize: 12, fill: '#888' },
        autoHide: true,
        autoRotate: true,
        rotate: Math.PI / 4,
        formatter: (text) => text,
      },
      tickCount: 5,
    },
    yAxis: {
      label: {
        style: { fontSize: 12, fill: '#888' },
      },
      min: 0,
      tickCount: 7,
      title: { text: 'kWh', style: { fontSize: 14, fill: '#888' } },
      grid: { line: { style: { stroke: '#eee', lineDash: [4, 0] } } },
    },
    animation: false,
    padding: [20, 20, 20, 40],
    color: {
      'from_pv': '#FF6B6B', // red
      'total_consumption': '#4ECDC4', // green/blue
    },
  };
};