import { Column } from '@ant-design/plots';
import { Button, DatePicker, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const getDateFormat = (period) => {
  switch (period) {
    case 'daily':
      return 'YYYY-MM-DD';
    case 'monthly':
      return 'YYYY-MM';
    case 'yearly':
      return 'YYYY';
    default:
      return 'YYYY';
  }
};

const YieldStatisticsPanel = ({
  title = 'Yield Statistics',
  selectedPeriod,
  setSelectedPeriod,
  selectedDate,
  setSelectedDate,
  chartData = [],
  chartConfig = {},
  children,
  hideDay
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
              {
                !hideDay && (
                  <Button 
                    type={selectedPeriod === 'daily' ? 'primary' : 'default'}
                    onClick={() => {
                      setSelectedDate(null);
                      setSelectedPeriod('daily')
                    }}
                  >
                    Day
                  </Button>
                )
              }
              <Button 
                type={selectedPeriod === 'monthly' ? 'primary' : 'default'}
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedPeriod('monthly')
                }}
              >
                Month
              </Button>
              <Button 
                type={selectedPeriod === 'yearly' ? 'primary' : 'default'}
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedPeriod('yearly')
                }}
              >
                Year
              </Button>
              <Button 
                type={selectedPeriod === 'lifetime' ? 'primary' : 'default'}
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedPeriod('lifetime')
                }}
              >
                Lifetime
              </Button>
            </Button.Group>
            {
              (selectedPeriod === 'yearly' || selectedPeriod === 'lifetime') && (
                <DatePicker
                  value={selectedDate || null}
                  onChange={setSelectedDate}
                  format={getDateFormat(selectedPeriod)}
                  picker={'year'}
                  disabled={selectedPeriod === 'lifetime'}
                  className="date-picker"
                  suffixIcon={null}
                  allowClear={true}
                  superPrevIcon={null}
                  superNextIcon={null}
                />
              )
            }
            {
              selectedPeriod === 'monthly' && (
                <DatePicker
                  value={selectedDate || null}
                  onChange={setSelectedDate}
                  format={getDateFormat(selectedPeriod)}
                  picker={'month'}
                  className="date-picker"
                  suffixIcon={null}
                  allowClear={false}
                  superPrevIcon={null}
                  superNextIcon={null}
                />
              )
            }

            {
              selectedPeriod === 'daily' && (
                <DatePicker
                  value={selectedDate || null}
                  onChange={setSelectedDate}
                  format={getDateFormat(selectedPeriod)}
                  picker={'date'}
                  className="date-picker"
                  suffixIcon={null}
                  allowClear={false}
                  superPrevIcon={null}
                  superNextIcon={null}
                />
              )
            }
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
              xField={chartConfig.xField}
              yField={chartConfig.yField}
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