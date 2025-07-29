import {
  ExclamationCircleOutlined,
  ExclamationOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

// Alarm data structure for reference
export const alarmDataStructure = {
  alarm_level: 'critical|major|minor|warning',
  station_name: 'Plant name',
  device_name: 'Device name',
  esn_code: 'Device serial number',
  alarm_id: 'Alarm identifier',
  alarm_name: 'Alarm name',
  alarm_begin_time: 'Alarm start time'
};

// Alarm level colors for reference
export const alarmLevelColors = {
  critical: '#f5222d',
  major: '#faad14',
  minor: '#1890ff',
  warning: '#bfbfbf'
};

// Alarm level icons for reference
export const alarmLevelIcons = {
  critical: <ExclamationCircleOutlined style={{ color: '#f5222d' }} />,
  major: <ThunderboltOutlined style={{ color: '#faad14' }} />,
  minor: <ExclamationOutlined style={{ color: '#1890ff' }} />,
  warning: <InfoCircleOutlined style={{ color: '#bfbfbf' }} />
};