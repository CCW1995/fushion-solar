import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, DatePicker, Typography } from 'antd';
import { Column } from '@ant-design/plots';

const { Title } = Typography;

const YieldStatisticsPanel = ({
  title = 'Yield Statistics',
  selectedPeriod,
  setSelectedPeriod,
  selectedDate,
  setSelectedDate,
  chartData = [],
  chartConfig = {},
  children
}) => {
  return (
    <div className="dashboard-panel transparent-panel" style={{ height: 'max-content' }}>
      <div className="panel-header flex-wrap">
        <div className="title-with-settings">
          <Title level={4}>{title}</Title>
        </div>
        <div className="panel-actions ml-auto">
          <div className="period-tabs" style={{ marginLeft: 'auto' }}>
            <Button.Group>
              <Button 
                type={selectedPeriod === 'day' ? 'primary' : 'default'}
                onClick={() => setSelectedPeriod('day')}
              >
                Day
              </Button>
              <Button 
                type={selectedPeriod === 'month' ? 'primary' : 'default'}
                onClick={() => setSelectedPeriod('month')}
              >
                Month
              </Button>
              <Button 
                type={selectedPeriod === 'year' ? 'primary' : 'default'}
                onClick={() => setSelectedPeriod('year')}
              >
                Year
              </Button>
              <Button 
                type={selectedPeriod === 'lifetime' ? 'primary' : 'default'}
                onClick={() => setSelectedPeriod('lifetime')}
              >
                Lifetime
              </Button>
            </Button.Group>
            <DatePicker
              value={selectedDate || null}
              onChange={setSelectedDate}
              format="YYYY-MM-DD"
              placeholder="2025-05-03"
              className="date-picker"
              suffixIcon={null}
              allowClear={false}
              prevIcon={<LeftOutlined />}
              nextIcon={<RightOutlined />}
              superPrevIcon={null}
              superNextIcon={null}
            />
          </div>
        </div>
      </div>
      <div className="panel-content">
        <div className="yield-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#40a9ff' }}></span>
          </div>
        </div>
        <div className="yield-chart">
          {children ? (
            children
          ) : (
            <Column
              data={chartData}
              xField={chartConfig.xField || 'hour'}
              yField={chartConfig.yField || 'value'}
              columnWidthRatio={chartConfig.columnWidthRatio || 0.6}
              columnStyle={chartConfig.columnStyle || { fill: '#52c41a', radius: [2, 2, 0, 0] }}
              yAxis={chartConfig.yAxis}
              xAxis={chartConfig.xAxis}
              interactions={chartConfig.interactions || [{ type: 'element-active' }]}
              height={chartConfig.height || 400}
              autoFit={chartConfig.autoFit || false}
              padding={chartConfig.padding || [30, 20, 60, 60]}
              appendPadding={chartConfig.appendPadding || [0, 0, 20, 0]}
            />
          )}
        </div>
        <div className="time-slider">
          <div className="slider-track"></div>
        </div>
      </div>
    </div>
  );
};

export default YieldStatisticsPanel; 