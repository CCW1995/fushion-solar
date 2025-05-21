import React, { useState, useEffect } from 'react';
import moment from 'moment';
import _ from 'lodash';
import './index.scss';
import { Card, Row, Col, Tooltip } from 'antd';
import PlantHeader from './components/PlantHeader';
import EnergyStats from './components/EnergyStats';
import PlantFlow from './components/PlantFlow';
import PlantInfo from './components/PlantInfo';
import YieldStatisticsPanel from '../../components/YieldStatisticsPanel';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import WithPlantView from './action';
import LoadingOverlay from 'components/Indicator/LoadingOverlay';

const renderRevenueLineConfig = (graphData, period) => ({
  data: _.map(graphData, item => ({
    period: (
      period === 'lifetime' ? moment(item.period).format('YYYY') :
      period === 'monthly' ? moment(item.period).format('DD/MM/YYYY') :
      period === 'yearly' ? moment(item.period).format('MM/YYYY') :
      item.period
    ),
    "Power Profit": item.power_profit,
  })),
  xField: 'period',
  yField: 'Power Profit',
  height: 220,
  smooth: true,
  legend: false,
  animation: false,
  padding: [20, 20, 20, 40],
  color: '#4ECDC4',
  meta: {
    power_profit: { alias: 'Power Profit' },
    period: { alias: 'Date' },
  }
});

const renderLineConfig = (graphData, period) => {
  // Transform the data to combine from_pv and total_consumption into a format suitable for two lines
  const transformedData = graphData.map(item => [
    {
      period: (
      period === 'lifetime' ? moment(item.period).format('YYYY') :
      period === 'monthly' ? moment(item.period).format('DD/MM/YYYY') :
      period === 'yearly' ? moment(item.period).format('MM/YYYY') :
      item.period
    ),
      value: item.from_pv,
      type: 'From PV',
      color: '#FF6B6B',
    },
    {
      period: (
      period === 'lifetime' ? moment(item.period).format('YYYY') :
      period === 'monthly' ? moment(item.period).format('DD/MM/YYYY') :
      period === 'yearly' ? moment(item.period).format('MM/YYYY') :
      item.period
    ),
      value: item.total_consumption,
      type: 'Total Consumption',
      color: '#4ECDC4',
    }
  ]).flat();

  return {
    data: transformedData,
    xField: 'period',
    yField: 'value',
    seriesField: 'type',
    height: 220,
    smooth: true,
    xAxis: {
      label: {
        style: { fontSize: 12, fill: '#888' },
        autoHide: true,
        autoRotate: true,
        rotate: Math.PI / 4,
        formatter: (text) => text,
      },
      tickCount: 5,
    },
    yAxis: {
      label: {
        style: { fontSize: 12, fill: '#888' },
      },
      min: 0,
      tickCount: 7,
      title: { text: 'kWh', style: { fontSize: 14, fill: '#888' } },
      grid: { line: { style: { stroke: '#eee', lineDash: [4, 0] } } },
    },
    animation: false,
    padding: [20, 20, 20, 40],
    color: {
      'from_pv': '#FF6B6B', // red
      'total_consumption': '#4ECDC4', // green/blue
    },
  };
};

const PlantMonitoringView = (props) => {
  const [selectedPeriod, setSelectedPeriod] = useState('lifetime');
  const [selectedPeriodRevenue, setSelectedPeriodRevenue] = useState('lifetime');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateRevenue, setSelectedDateRevenue] = useState(null);

  const {plantData} = props

  useEffect(() => {
    if(selectedPeriod === 'lifetime') {
      return setSelectedDate(null);
    }

    return setSelectedDate(new Date());

  }, [selectedPeriod])

  useEffect(() => {
    if(selectedPeriodRevenue === 'lifetime') {
      return setSelectedDateRevenue(null);
    }

    return setSelectedDateRevenue(new Date());

  }, [selectedPeriodRevenue])

  useEffect(() => {
    if (props.data.StationReducer.station_name) {
      props.getPlantView(props.data.StationReducer.station_name);
    }
  }, [props.data]);

  useEffect(() => {
    if (props.data.StationReducer.station_name) {
      if (selectedPeriod !== 'lifetime') { 
        selectedDate && props.getPlantEnergyData(props.data.StationReducer.station_name, selectedPeriod, selectedDate);
      } else {
        props.getPlantEnergyData(props.data.StationReducer.station_name, selectedPeriod, selectedDate);
      }
    }
  }, [selectedPeriod, selectedDate]);

  useEffect(() => {
    if (selectedPeriodRevenue !== 'lifetime') { 
      selectedDateRevenue && props.getPlantRevenue(props.data.StationReducer.station_name, selectedPeriodRevenue, selectedDateRevenue);
    } else {
      props.getPlantRevenue(props.data.StationReducer.station_name, selectedPeriodRevenue, selectedDateRevenue);
    }
  }, [selectedPeriodRevenue, selectedDateRevenue]);

  return (
    <div className="plant-monitoring-container">
      {/* Header */}
      <PlantHeader plantName={plantData?.stationInfo?.[0]?.station_name}/>

      {/* Stats Row */}
      <EnergyStats plantInfo={plantData?.stationInfo?.[0]??{}} />

      {/* Main Section: Flow (left) + Info (right) */}
      <div className="main-section-card">
        <Row gutter={[0, 0]} className="main-section">
          <Col xs={24} md={6} className="main-section-left">
            <PlantFlow energyData={plantData.energyData} />
          </Col> 
          <Col xs={24} md={18} className="main-section-right">
            <PlantInfo 
              plantInfo={plantData?.stationInfo??{}}
              alarmCount={plantData?.alarmCount??{}}
              envBenefit={plantData?.envBenefit??{}}
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
                      <div className="ems-title">Yield: {(props.plantEnergyData?.energy?.totalData?.[0]?.pv_yield || 0).toFixed(2)} <span className="ems-main-unit">kWh</span></div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="ems-sub-row">
                        <span className="ems-sub ems-green">{(props.plantEnergyData?.energy?.totalData?.[0]?.consumed || 0).toFixed(2)}</span>
                        <span className="ems-sub-label">From PV (kWh)</span>
                      </div>
                      <div className="ems-sub-row" style={{ textAlign: 'right' }}>
                        <span className="ems-sub ems-light">{(props.plantEnergyData?.energy?.totalData?.[0]?.feed_to_grid || 0).toFixed(2)}</span>
                        <span className="ems-sub-label">From grid (kWh)</span>
                      </div>
                    </div>
                    {
                      props.plantEnergyData?.energy?.totalData?.[0]?.pv_yield && props.plantEnergyData?.energy?.totalData?.[0]?.feed_to_grid && (
                        <div className="ems-progress-group">
                          <div className="ems-progress-bar ems-progress-green" style={{ width: `${(props.plantEnergyData?.energy?.totalData?.[0]?.consumed / (props.plantEnergyData?.energy?.totalData?.[0]?.pv_yield) * 100).toFixed(2)}%` }}>
                            <span>{(props.plantEnergyData?.energy?.totalData?.[0]?.consumed / (props.plantEnergyData?.energy?.totalData?.[0]?.pv_yield) * 100).toFixed(2)}%</span>
                          </div>
                          <div className="ems-progress-bar ems-progress-light" style={{ width: `${(props.plantEnergyData?.energy?.totalData?.[0]?.feed_to_grid / (props.plantEnergyData?.energy?.totalData?.[0]?.pv_yield) * 100).toFixed(2)}%` }}>
                            <span>{(props.plantEnergyData?.energy?.totalData?.[0]?.feed_to_grid / (props.plantEnergyData?.energy?.totalData?.[0]?.pv_yield) * 100).toFixed(2)}%</span>
                          </div>
                        </div>
                      )
                    }
                  </div>
                  
                  {/* Consumption (right) */}
                  {
                    props.plantEnergyData?.consumption?.sumData?.[0]?.total_consumption && (
                      <div className="ems-summary-col ems-consumption-col">
                        <div className="d-flex">
                          <div className="ems-title">Consumption: {(props.plantEnergyData?.consumption?.sumData?.[0]?.total_consumption || 0).toFixed(2)} <span className="ems-main-unit">kWh</span></div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="ems-sub-row">
                            <span className="ems-sub ems-orange">{(props.plantEnergyData?.consumption?.sumData?.[0]?.from_pv || 0).toFixed(2)}</span>
                            <span className="ems-sub-label">From PV (kWh)</span>
                          </div>
                          <div className="ems-sub-row" style={{ textAlign: 'right' }}>
                            <span className="ems-sub ems-yellow">{(props.plantEnergyData?.consumption?.sumData?.[0]?.from_grid || 0).toFixed(2)}</span>
                            <span className="ems-sub-label">From grid (kWh)</span>
                          </div>
                        </div>
                        <div className="ems-progress-group ems-progress-group-segmented">
                          <div className="ems-progress-bar ems-progress-orange" style={{ width: `${(props.plantEnergyData?.consumption?.sumData?.[0]?.from_pv / props.plantEnergyData?.consumption?.sumData?.[0]?.total_consumption * 100).toFixed(2)}%` }}>
                            <span>
                              {`${(props.plantEnergyData?.consumption?.sumData?.[0]?.from_pv / props.plantEnergyData?.consumption?.sumData?.[0]?.total_consumption * 100).toFixed(2)}%`}
                            </span>
                          </div>
                          <div className="ems-progress-bar ems-progress-yellow" style={{ width: `${(props.plantEnergyData?.consumption?.sumData?.[0]?.from_grid / props.plantEnergyData?.consumption?.sumData?.[0]?.total_consumption * 100).toFixed(2)}%` }}>
                            <span>
                              {`${(props.plantEnergyData?.consumption?.sumData?.[0]?.from_grid / props.plantEnergyData?.consumption?.sumData?.[0]?.total_consumption * 100).toFixed(2)}%`}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </div>
                {/* Chart and legend */}
                <div className="ems-chart-row">
                  <div className="ems-line-chart-placeholder" style={{ overflowX: 'auto', minWidth: 0 }}>
                    <div style={{ minWidth: Math.max(500, (props.plantEnergyData?.consumption?.graphData?.length || 0) * 60) }}>
                      <Line {...renderLineConfig(props.plantEnergyData?.consumption?.graphData??[], selectedPeriod)} />
                    </div>
                  </div>
                </div>
              </div>
            </YieldStatisticsPanel>
          </Card>
        </Col>
        <Col xs={24} md={12}>
        <Card 
            style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            >
            <YieldStatisticsPanel
              title={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Revenue
                  <Tooltip title="Info about energy management."><InfoCircleOutlined style={{ color: '#b0b0b0', marginLeft: 4 }} /></Tooltip>
                </span>
              }
              hideDay={true}
              selectedPeriod={selectedPeriodRevenue}
              setSelectedPeriod={setSelectedPeriodRevenue}
              selectedDate={selectedDateRevenue}
              setSelectedDate={setSelectedDateRevenue}
            >
              <div className="energy-management-summary">
                <div className="ems-summary-row">
                  {/* Yield (left) */}
                  <div className="ems-summary-col ems-consumption-col">
                    <div className="d-flex">
                      <div className="ems-title">Sum: {props.plantRevenue?.sumData?.total || 0} <span className="ems-main-unit">kWh</span></div>
                    </div>
                  </div>
                </div>
                {/* Chart and legend */}
                <div className="ems-chart-row">
                  <div className="ems-line-chart-placeholder" style={{ overflowX: 'auto', minWidth: 0 }}>
                    <div style={{ minWidth: Math.max(500, (props.plantRevenue?.graphData?.length || 0) * 60) }}>
                      <Line {...renderRevenueLineConfig(props.plantRevenue.graphData, selectedPeriodRevenue)} />
                    </div>
                  </div>
                </div>
              </div>
            </YieldStatisticsPanel>
          </Card>
        </Col>
      </Row>
      {
        props.onLoadPlantView && <LoadingOverlay />
      }
    </div>
  );
};

export default WithPlantView(PlantMonitoringView);
