import React, { useState } from 'react';
import { Card, Typography, Space, Tooltip } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Pie } from '@ant-design/plots';
import './DashboardWidget.scss';

const { Title, Text } = Typography;

// Chart component using Pie from @ant-design/plots
const PieChart = ({ data, colors, innerContent }) => {
  // Calculate total value for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.8,
    color: colors,
    legend: false,
    animation: true,
    //tooltip: {
      //formatter: (datum) => {
        //const percentage = ((datum.value / total) * 100).toFixed(1);
        //return { name: datum.type, value: `${datum.value} (${percentage}%)` };
      //}
    //},
    interactions: [
      {
        type: 'element-active',
      }
    ],
    state: {
      active: {
        style: {
          lineWidth: 6,
          stroke: (datum) => {
            // Get the color from the data item's color or from the colors array
            const color = datum.color || colors[data.findIndex(item => item.type === datum.type)];
            return color;
          },
        },
      },
    },
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: 0, // Hide original statistic
        },
        formatter: () => '',
        customHtml: () => ' ', // Empty string to hide default content
      },
    },
    pieStyle: {
      stroke: null,
      lineWidth: 3,
    },
    label: false,
  };

  return (
    <div className="pie-chart-container">
      <Pie {...config} />
      <div className="center-content">
        {innerContent}
      </div>
    </div>
  );
};

const DashboardWidget = ({ 
  title, 
  value, 
  unit, 
  subtitle,
  infoIcon,
  items = [],
  chartData,
  chartColors,
  chartInnerContent,
  onViewMore,
  transparent = false,
  rightIcon
}) => {
  return (
    <Card className={`dashboard-widget ${transparent ? 'transparent-widget' : ''}`}>
      <div className="widget-header">
        <div className="widget-title">
          <Title level={5}>{title}</Title>
          {infoIcon && <span className="info-icon">{infoIcon}</span>}
        </div>
        <div className="widget-action" onClick={onViewMore}>
          {rightIcon || (onViewMore && <RightOutlined />)}
        </div>
      </div>
      
      {!chartData && (
        <div className="widget-content">
          <div className="widget-value">
            <Title level={3}>{value}</Title>
            <Text className="unit">{unit}</Text>
          </div>
          {subtitle && <Text className="subtitle">{subtitle}</Text>}
        </div>
      )}
      
      {chartData && chartData.length > 0 && (
        <div className="widget-chart">
          <div className="chart-container">
            <PieChart 
              data={chartData} 
              colors={chartColors}
              innerContent={chartInnerContent}
            />
          </div>
          
          <div className="chart-legends">
            {items.map((item, index) => (
              <div key={index} className="chart-legend-item">
                <div className="legend-value">
                  {item.icon ? (
                    item.icon
                  ) : (
                    <span 
                      className="chart-legend-dot" 
                      style={{ backgroundColor: chartColors?.[index] }}
                    ></span>
                  )}
                  <Text>{item.value}</Text>
                </div>
                <Text type="secondary">{item.label}</Text>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default DashboardWidget; 