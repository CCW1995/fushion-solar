import React from 'react';
import { InfoCircleOutlined, SunOutlined, BarChartOutlined, ThunderboltOutlined, NodeIndexOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const stats = [
  {
    key: 'yieldToday',
    label: 'Yield today',
    icon: <SunOutlined className="stat-svg-icon" />,
    info: false,
  },
  {
    key: 'totalYield',
    label: 'Total yield',
    icon: <BarChartOutlined className="stat-svg-icon" />,
    info: true,
  },
  {
    key: 'consumptionToday',
    label: 'Consumption today',
    icon: <ThunderboltOutlined className="stat-svg-icon" />,
    info: false,
  },
  {
    key: 'consumedFromPv',
    label: 'Consumed from PV',
    icon: <NodeIndexOutlined className="stat-svg-icon" />,
    info: true,
  },
];

const EnergyStats = ({ energyData }) => {
  return (
    <div className="energy-stats-card">
      <div className="energy-stats-row">
        {stats.map((stat, idx) => (
          <div className="stat-block" key={stat.key}>
            <div className="stat-icon">{stat.icon}</div>
            <div>
              <div className="stat-value-row">
                <span className="stat-value">{energyData[stat.key]}</span>
                <span className="stat-unit">kWh</span>
              </div>
              <div className="stat-label-row">
                <span className="stat-label">{stat.label}</span>
                {stat.info && (
                  <Tooltip title={
                    <>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut optio harum molestiae possimus expedita libero dolorem quos voluptatibus, rerum provident reprehenderit, eum animi nihil fugit suscipit itaque nulla aut, id ex eius. Doloribus magnam dolore doloremque impedit inventore officia ipsam sunt eligendi veritatis quisquam ab, id animi laboriosam eveniet natus?
                    </>
                  }>
                    <InfoCircleOutlined className="stat-info-icon" />
                  </Tooltip>
                )}
              </div>
              {idx < stats.length - 1 && <div className="stat-divider" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnergyStats; 