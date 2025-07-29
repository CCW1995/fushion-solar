import {
  DollarOutlined,
  ExclamationCircleOutlined,
  ExclamationOutlined,
  FieldTimeOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import moment from 'moment';

// Plant List Table Data
export const getPlantTableColumns = (navigate) => [
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: status => (
      <div className={`status-indicator ${status === 'online' ? 'normal' : status === 'offline' ? 'faulty' : 'disconnected'}`} />
    )
  },
  {
    title: 'Inverter Brand',
    dataIndex: 'schema_name'
  },
  {
    title: 'Station Name',
    dataIndex: 'station_name',
    key: 'name',
    render: name => (
      <a 
        className="plant-name-link" 
        onClick={() => navigate(`/dashboard/plant-monitoring?plantName=${encodeURIComponent(name)}`)}
        style={{ cursor: 'pointer' }}
      >
        {name}
      </a>
    )
  },
  {
    title: 'Station Code',
    dataIndex: 'station_code',
    key: 'station_code',
  },
  {
    title: 'Address',
    dataIndex: 'station_address',
    key: 'station_address',
  },
  {
    title: 'Grid Connection Date',
    dataIndex: 'grid_connection_date',
    key: 'grid_connection_date',
    render: date => date ? moment(date).format('YYYY-MM-DD') : '-'
  },
  {
    title: 'Total String Capacity (kW)',
    dataIndex: 'capacity',
    key: 'capacity'
  }
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
        unit: 'kW',
        label: 'Current power',
        icon: <LineChartOutlined />,
      },
      {
        id: 'today_power',
        unit: 'MWh',
        label: 'Power today',
        icon: <FieldTimeOutlined />,
      },
      {
        id: 'today_income',
        unit: '',
        label: 'Revenue today',
        icon: <DollarOutlined />,
      },
      {
        id: 'total_power',
        unit: 'MWh',
        label: 'Total Power',
        icon: <FieldTimeOutlined />,
      }
    ];
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