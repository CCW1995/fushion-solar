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

// Plant List Table Columns Configuration
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
    title: 'Purchase Type',
    dataIndex: 'purchase_type',
    key: 'purchase_type',
  },
  {
    title: 'System Capacity',
    dataIndex: 'capacity',
    key: 'capacity',
  },
  {
    title: 'Longitude',
    dataIndex: 'longitude',
    key: 'longitude',
  },
  {
    title: 'Latitude',
    dataIndex: 'latitude',
    key: 'latitude',
  },
  {
    title: "Inverter ID/Serial Number",
    dataIndex: 'device_sn',
    key: 'device_sn'
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

// KPI Parameters Configuration
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

// KPI Configuration
export const renderKpi = () => [
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