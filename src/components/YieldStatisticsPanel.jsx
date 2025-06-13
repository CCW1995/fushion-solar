import { Column } from '@ant-design/plots';
import { Button, Typography } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import moment from 'moment';

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
          <div className="period-tabs d-flex flex-wrap" style={{ marginLeft: 'auto' }}>
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
                onClick={() => {;
                  setSelectedPeriod('lifetime')
                }}
              >
                Lifetime
              </Button>
            </Button.Group>
            {
              (selectedPeriod === 'yearly' || selectedPeriod === 'lifetime') && (
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  showYearPicker
                  dateFormat="yyyy"
                  className="form-control"
                  maxDate={new Date()}
                />
              )
            }
            {
              selectedPeriod === 'monthly' && (
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  showMonthYearPicker
                  dateFormat="MM/yyyy"
                  className="form-control"
                  maxDate={new Date()}
                />
              )
            }
            {
              selectedPeriod === 'daily' && (
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  maxDate={new Date()}
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