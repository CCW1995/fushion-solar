import React from 'react';
import { InfoCircleOutlined, ThunderboltOutlined, BarChartOutlined, ThunderboltFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';

// Energy statistics configuration
const stats = [
  {
    key: 'day_power',
    label: 'Yield today',
    icon: <ThunderboltOutlined className="stat-svg-icon" />,
    unit: 'kWh',
    info: false,
  },
  {
    key: 'month_power',
    label: 'Yield this month',
    icon: <BarChartOutlined className="stat-svg-icon" />,
    unit: 'kWh',
    info: false,
  },
  {
    key: 'year_power',
    label: 'Yield this year',
    icon: <BarChartOutlined className="stat-svg-icon" />,
    unit: 'kWh',
    info: false,
  },
  {
    key: 'total_power',
    label: 'Total yield',
    icon: <ThunderboltFilled className="stat-svg-icon" />,
    unit: 'kWh',
    info: true,
  }
];

const EnergyStats = ({ plantInfo, planInfoBasic, deviceRealTime }) => {
  // Helper function to get stat value
  const getStatValue = (stat) => {
    if (stat.key === 'capacity') {
      return planInfoBasic.capacity || 0;
    }
    return plantInfo[stat.key] || 0;
  };

  return (
    <div className="energy-stats-card">
      <div className="energy-stats-row">
        {/* Render configured stats */}
        {stats.map((stat, idx) => (
          <div className="stat-block" key={stat.key}>
            <div className="stat-icon">{stat.icon}</div>
            <div>
              <div className="stat-value-row">
                <span className="stat-value">{getStatValue(stat)}</span>
                <span className="stat-unit">{stat.unit}</span>
              </div>
              <div className="stat-label-row">
                <span className="stat-label">{stat.label}</span>
                {stat.info && (
                  <Tooltip title="Total yield is the cumulative energy produced by the plant since commissioning.">
                    <InfoCircleOutlined className="stat-info-icon" />
                  </Tooltip>
                )}
              </div>
              {idx < stats.length - 1 && <div className="stat-divider" />}
            </div>
          </div>
        ))}
        
        {/* Active Power stat */}
        <div className="stat-block">
          <div className="stat-icon">
            <BarChartOutlined className="stat-svg-icon" />
          </div>
          <div>
            <div className="stat-value-row">
              <span className="stat-value">{deviceRealTime}</span>
              <span className="stat-unit">kWh</span>
            </div>
            <div className="stat-label-row">
              <span className="stat-label">Active Power</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyStats; 