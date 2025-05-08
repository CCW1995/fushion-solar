import {
  DollarOutlined,
  ExclamationCircleOutlined,
  ExclamationOutlined,
  FieldTimeOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
import React from 'react';

// Plant List Table Data
export const plantTableColumns = [
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: status => (
      <div className={`status-indicator ${status === 'normal' ? 'normal' : status === 'faulty' ? 'faulty' : 'disconnected'}`} />
    )
  },
  {
    title: 'Plant Image',
    dataIndex: 'image',
    key: 'image',
    width: 100,
    render: imgUrl => <img src={imgUrl} alt="Plant" className="plant-thumbnail" />
  },
  {
    title: 'Plant Name',
    dataIndex: 'name',
    key: 'name',
    render: name => <a className="plant-name-link">{name}</a>,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Country/Region',
    dataIndex: 'region',
    key: 'region',
    sorter: (a, b) => a.region.localeCompare(b.region),
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Grid Connection Date',
    dataIndex: 'connectionDate',
    key: 'connectionDate',
    sorter: (a, b) => new Date(a.connectionDate) - new Date(b.connectionDate),
  },
  {
    title: 'Total String Capacity (kW)',
    dataIndex: 'stringCapacity',
    key: 'stringCapacity',
    sorter: (a, b) => a.stringCapacity - b.stringCapacity,
  },
  {
    title: 'Current Power (kW)',
    dataIndex: 'currentPower',
    key: 'currentPower',
    sorter: (a, b) => a.currentPower - b.currentPower,
  },
  {
    title: 'Specific Energy (kWh/kWp)',
    dataIndex: 'specificEnergy',
    key: 'specificEnergy',
    sorter: (a, b) => a.specificEnergy - b.specificEnergy,
  },
  {
    title: 'Yield Today (kWh)',
    dataIndex: 'yieldToday',
    key: 'yieldToday',
    sorter: (a, b) => a.yieldToday - b.yieldToday,
  },
  {
    title: 'Total Yield (kWh)',
    dataIndex: 'totalYield',
    key: 'totalYield',
    sorter: (a, b) => a.totalYield - b.totalYield,
    render: (text) => (
      <Space>
        {text}
        <Tooltip title="Total energy generated since the plant was installed">
          <InfoCircleOutlined />
        </Tooltip>
      </Space>
    )
  },
];

export const plantTableData = [
  {
    key: '1',
    status: 'normal',
    image: 'https://via.placeholder.com/60x40',
    name: 'LEE4453_Kan Kwok Leong',
    region: 'Malaysia',
    address: 'SelangorPetaling JayaSS2',
    connectionDate: '2025-04-30',
    stringCapacity: 4.590,
    currentPower: 0.00,
    specificEnergy: 1.06,
    yieldToday: 4.86,
    totalYield: 9.01
  },
  {
    key: '2',
    status: 'normal',
    image: 'https://via.placeholder.com/60x40',
    name: 'LEE6480–Hairil Anwar',
    region: 'Malaysia',
    address: 'Malaysia, Selangor, Shah Alam',
    connectionDate: '2025-04-30',
    stringCapacity: 12.240,
    currentPower: 0.00,
    specificEnergy: 2.47,
    yieldToday: 30.19,
    totalYield: 56.32
  },
  {
    key: '3',
    status: 'normal',
    image: 'https://via.placeholder.com/60x40',
    name: 'LEE5730 BUDIYANTO',
    region: 'Malaysia',
    address: 'SelangorBantingTanjong Dua Belas',
    connectionDate: '2025-04-30',
    stringCapacity: 6.630,
    currentPower: 0.00,
    specificEnergy: 3.48,
    yieldToday: 23.07,
    totalYield: 46.86
  },
  {
    key: '4',
    status: 'normal',
    image: 'https://via.placeholder.com/60x40',
    name: 'LEE5555–Jawaria',
    region: 'Malaysia',
    address: '47000 Shah Alam, Selangor, Malaysia',
    connectionDate: '2025-04-30',
    stringCapacity: 4.590,
    currentPower: 0.00,
    specificEnergy: 1.43,
    yieldToday: 6.55,
    totalYield: 17.02
  }
];

export const allParameters = [
  { id: 'current_power', label: 'Current power' },
  { id: 'yield_today', label: 'Yield today' },
  { id: 'revenue_today', label: 'Revenue today' },
  { id: 'total_yield', label: 'Total yield' },
  { id: 'inverter_rated_power', label: 'Inverter rated power' },
  { id: 'rated_ess_capacity', label: 'Rated ESS capacity', category: 'Energy Storage Scenario' },
  { id: 'energy_charged_today', label: 'Energy charged today', category: 'Energy Storage Scenario' },
  { id: 'energy_discharged_today', label: 'Energy discharged today', category: 'Energy Storage Scenario' },
  { id: 'total_energy_charged', label: 'Total energy charged', category: 'Energy Storage Scenario' },
  { id: 'total_energy_discharged', label: 'Total energy discharged', category: 'Energy Storage Scenario' }
];


  // Data for Plant Status widget
  export const plantStatusData = [
    { type: 'Normal', value: 301 },
    { type: 'Faulty', value: 1 },
    { type: 'Disconnected', value: 14 }
  ];

  export const plantStatusItems = [
    { count: 301, label: 'Normal', icon: <span className="status-dot normal" /> },
    { count: 1, label: 'Faulty', icon: <span className="status-dot faulty" /> },
    { count: 14, label: 'Disconnected', icon: <span className="status-dot disconnected" /> }
  ];


  // Updated data for Plant KPIs widget
  export const renderKpi = selectedParameters => {
    return  [
      {
        id: 'current_power',
        value: '0.00',
        unit: 'kW',
        label: 'Current power',
        icon: <LineChartOutlined />,
      },
      {
        id: 'yield_today',
        value: '6.58',
        unit: 'MWh',
        label: 'Yield today',
        icon: <FieldTimeOutlined />,
      },
      {
        id: 'revenue_today',
        value: '21.65K',
        unit: '',
        label: 'Revenue today',
        icon: <DollarOutlined />,
      },
      {
        id: 'total_yield',
        value: '607.15',
        unit: 'MWh',
        label: 'Total yield',
        icon: <FieldTimeOutlined />,
      },
      {
        id: 'inverter_rated_power',
        value: '1.89',
        unit: 'MW',
        label: 'Inverter rated power',
        icon: <ThunderboltOutlined />,
      }
    ].filter(item => selectedParameters.includes(item.id));
  }

  // Data for Active Alarms widget with all alarm types represented
  export const alarmStatusData = [
    { type: 'Critical', value: 0 },
    { type: 'Major', value: 13 },
    { type: 'Minor', value: 0 },
    { type: 'Warning', value: 0 }
  ];

  export const alarmStatusItems = [
    { count: 0, label: 'Critical', icon: <div className="alarm-icon critical"><ExclamationCircleOutlined /></div> },
    { count: 13, label: 'Major', icon: <div className="alarm-icon major"><ThunderboltOutlined /></div> },
    { count: 0, label: 'Minor', icon: <div className="alarm-icon minor"><ExclamationOutlined /></div> },
    { count: 0, label: 'Warning', icon: <div className="alarm-icon warning"><InfoCircleOutlined /></div> }
  ];