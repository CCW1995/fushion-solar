import React, { useState, useEffect } from 'react';
import './index.scss';
import { Card, Row, Col, Typography, Tooltip } from 'antd';
import PlantHeader from './components/PlantHeader';
import EnergyStats from './components/EnergyStats';
import PlantFlow from './components/PlantFlow';
import PlantInfo from './components/PlantInfo';
import { plantName, weatherData } from './assets';
import YieldStatisticsPanel from '../../components/YieldStatisticsPanel';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import WithPlantView from './action';

const dummyLineData = [
  // PV output (green)
  { time: '00:00', value: 0.2, type: 'PV output' },
  { time: '06:00', value: 0.5, type: 'PV output' },
  { time: '09:00', value: 1.2, type: 'PV output' },
  { time: '12:00', value: 2.5, type: 'PV output' },
  { time: '15:00', value: 1.8, type: 'PV output' },
  { time: '18:00', value: 0.6, type: 'PV output' },
  { time: '21:00', value: 0.1, type: 'PV output' },
  // Total consumption (red)
  { time: '00:00', value: 2.0, type: 'Total consumption' },
  { time: '06:00', value: 2.2, type: 'Total consumption' },
  { time: '09:00', value: 2.5, type: 'Total consumption' },
  { time: '12:00', value: 2.8, type: 'Total consumption' },
  { time: '15:00', value: 2.3, type: 'Total consumption' },
  { time: '18:00', value: 1.7, type: 'Total consumption' },
  { time: '21:00', value: 1.2, type: 'Total consumption' },
  // Consumed from PV (blue)
  { time: '00:00', value: 0.1, type: 'Consumed from PV' },
  { time: '06:00', value: 0.3, type: 'Consumed from PV' },
  { time: '09:00', value: 0.8, type: 'Consumed from PV' },
  { time: '12:00', value: 1.7, type: 'Consumed from PV' },
  { time: '15:00', value: 1.2, type: 'Consumed from PV' },
  { time: '18:00', value: 0.4, type: 'Consumed from PV' },
  { time: '21:00', value: 0.05, type: 'Consumed from PV' },
];

const lineConfig = {
  data: dummyLineData,
  xField: 'time',
  yField: 'value',
  seriesField: 'type',
  color: (type) => {
    if (type === 'PV output') return '#389e0d';
    if (type === 'Total consumption') return '#f5222d';
    if (type === 'Consumed from PV') return '#1890ff';
    return '#888';
  },
  height: 220,
  smooth: true,
  legend: false,
  xAxis: {
    label: {
      style: { fontSize: 12, fill: '#888' },
    },
    tickCount: 7,
  },
  yAxis: {
    label: {
      style: { fontSize: 12, fill: '#888' },
    },
    min: 0,
    max: 3,
    tickCount: 7,
    title: { text: 'kW', style: { fontSize: 14, fill: '#888' } },
    grid: { line: { style: { stroke: '#eee', lineDash: [4, 0] } } },
  },
  tooltip: {
    showTitle: false,
    formatter: (datum) => ({ name: datum.type, value: `${datum.value} kW` }),
  },
  animation: false,
  padding: [20, 20, 20, 40],
};

const PlantMonitoringView = (props) => {
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [selectedDate, setSelectedDate] = useState(null);

  const {plantData} = props

  useEffect(() => {
    props.getPlantView();
  }, []);

  return (
    <div className="plant-monitoring-container">
      {/* Header */}
      <PlantHeader plantName={plantName} weatherData={weatherData} />

      {/* Stats Row */}
      <EnergyStats plantInfo={plantData.info[0]} />

      {/* Main Section: Flow (left) + Info (right) */}
      <div className="main-section-card">
        <Row gutter={[0, 0]} className="main-section">
          <Col xs={24} md={6} className="main-section-left">
            <PlantFlow energyData={plantData.energyData} />
          </Col> 
          <Col xs={24} md={18} className="main-section-right">
            <PlantInfo 
              plantInfo={plantData.info[0]}
              alarmCount={plantData.alarmCount[0]}
              envBenefit={plantData.envBenefit[0]}
            />
          </Col>
        </Row>
        {/* Energy Management Panel in Card, Col span=12 */}
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card 
            style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            >
            <YieldStatisticsPanel
              title={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Energy Management
                  <Tooltip title="Info about energy management."><InfoCircleOutlined style={{ color: '#b0b0b0', marginLeft: 4 }} /></Tooltip>
                </span>
              }
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            >
              <div className="energy-management-summary">
                <div className="ems-summary-row">
                  {/* Yield (left) */}
                  <div className="ems-summary-col ems-consumption-col">
                    <div className="d-flex">
                      <div className="ems-title">Yield: 7.40 <span className="ems-main-unit">kWh</span></div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="ems-sub-row">
                        <span className="ems-sub ems-green">7.40</span>
                        <span className="ems-sub-label">From PV (kWh)</span>
                      </div>
                      <div className="ems-sub-row" style={{ textAlign: 'right' }}>
                        <span className="ems-sub ems-light">14.93</span>
                        <span className="ems-sub-label">From grid (kWh)</span>
                      </div>
                    </div>
                    <div className="ems-progress-group">
                      <div className="ems-progress-bar ems-progress-green" style={{ width: '100%' }}>
                        <span>100.00%</span>
                      </div>
                      <div className="ems-progress-bar ems-progress-light" style={{ width: '0%' }}>
                        <span>0.00%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Consumption (right) */}
                  <div className="ems-summary-col ems-consumption-col">
                    <div className="d-flex">
                      <div className="ems-title">Consumption: 22.33 <span className="ems-main-unit">kWh</span></div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="ems-sub-row">
                        <span className="ems-sub ems-orange">7.40</span>
                        <span className="ems-sub-label">From PV (kWh)</span>
                      </div>
                      <div className="ems-sub-row" style={{ textAlign: 'right' }}>
                        <span className="ems-sub ems-yellow">14.93</span>
                        <span className="ems-sub-label">From grid (kWh)</span>
                      </div>
                    </div>
                    <div className="ems-progress-group ems-progress-group-segmented">
                      <div className="ems-progress-bar ems-progress-orange" style={{ width: '33.14%' }}>
                        <span>33.14%</span>
                      </div>
                      <div className="ems-progress-bar ems-progress-yellow" style={{ width: '66.86%' }}>
                        <span>66.86%</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Chart and legend */}
                <div className="ems-chart-row">
                  <div className="ems-line-chart-placeholder">
                    <Line {...lineConfig} />
                    <div className="ems-legend-row">
                      <span className="ems-legend">
                        <span className="ems-legend-dot ems-legend-green"></span>
                        PV output
                      </span>
                      <span className="ems-legend">
                        <span className="ems-legend-dot ems-legend-red"></span>
                        Total consumption
                      </span>
                      <span className="ems-legend">
                        <span className="ems-legend-dot ems-legend-blue"></span>
                        Consumed from PV
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </YieldStatisticsPanel>
          </Card>
        </Col>
        <Col xs={24} md={12}>
        </Col>
      </Row>
    </div>
  );
};

export default WithPlantView(PlantMonitoringView);
