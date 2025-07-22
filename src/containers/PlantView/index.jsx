import React, { useState, useEffect } from 'react';
import moment from 'moment';
import _ from 'lodash';
import './index.scss';
import { Card, Row, Col, Tooltip } from 'antd';
import { useLocation, useHistory } from 'react-router-dom';
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
      period === 'monthly' ? moment(item.period).format('MM/DD') :
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

const renderCombinedLineConfig = (energyData, consumptionData, period) => {
  // Map energy data (e.g., From PV)
  const energyLine = (energyData ?? []).map(item => ({
    period: (
      period === 'lifetime' ? moment(item.period).format('YYYY') :
      period === 'monthly' ? moment(item.period).format('MM/DD') :
      period === 'yearly' ? moment(item.period).format('MM/YYYY') :
      period === 'daily' ? moment(item.period).format('HH:mm') : moment(item.period).toString()
    ),
    value: item.inverter_power,
    type: 'Inverter Power',
  }));

  // Map consumption data (e.g., Total Consumption)
  const consumptionLine = (consumptionData ?? []).map(item => ({
    period: (
      period === 'lifetime' ? moment(item.period).format('YYYY') :
      period === 'monthly' ? moment(item.period).format('MM/DD') :
      period === 'yearly' ? moment(item.period).format('MM/YYYY') :
      period === 'daily' ? moment(item.period).format('HH:mm') : moment(item.period).toString()
    ),
    value: item.total_consumption,
    type: 'Total Consumption',
  }));

  const fromPV = (consumptionData ?? []).map(item => ({
    period: (
      period === 'lifetime' ? moment(item.period).format('YYYY') :
      period === 'monthly' ? moment(item.period).format('MM/DD') :
      period === 'yearly' ? moment(item.period).format('MM/YYYY') :
      period === 'daily' ? moment(item.period).format('HH:mm') : moment(item.period).toString()
    ),
    value: item.from_pv,
    type: 'From PV',
  }));
  
  // Combine both lines
  const combinedData = [...energyLine, ...consumptionLine, ... fromPV];

  return {
    data: combinedData,
    xField: 'period',
    yField: 'value',
    seriesField: 'type',
    height: 220,
    smooth: true,
    xAxis: {
      label:  period === 'daily' ? null : {
        style: { fontSize: 12, fill: '#888' },
        autoHide: false,
        autoRotate: false,
        rotate: Math.PI / 2,
        formatter: (text) => text,
      },
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
    color: ['#FF6B6B', '#4ECDC4'],
  };
};

const PlantMonitoringView = (props) => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedPeriodRevenue, setSelectedPeriodRevenue] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateRevenue, setSelectedDateRevenue] = useState(new Date());

  const {plantData} = props;
  const location = useLocation();
  const history = useHistory();
  
  // Extract plantName from URL parameters
  const getPlantNameFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('plantName');
  };

  // Determine which plant name to use based on user role
  const getPlantNameToUse = () => {
    const userProfile = props.data.ProfileReducer.profile;
    const isAdmin = userProfile?.role?.name === 'Admin';
    const plantNameFromURL = getPlantNameFromURL();
    
    // If user is admin and plantName is in URL, use it
    if (isAdmin && plantNameFromURL) {
      return plantNameFromURL;
    }
    
    // Otherwise use the station name from props (admin or no URL parameter)
    return props.data.StationReducer.station_name;
  };

  const plantNameToUse = getPlantNameToUse();

  // Redirect admin users back to dashboard if no plantName in URL
  useEffect(() => {
    const userProfile = props.data.ProfileReducer.profile;
    const isAdmin = userProfile?.role?.name === 'Admin';
    const plantNameFromURL = getPlantNameFromURL();
    
    if (isAdmin && !plantNameFromURL) {
      history.push('/dashboard/home');
    }
  }, [props.data.ProfileReducer.profile]);

  useEffect(() => {
    setSelectedDate(new Date());
  }, [selectedPeriod])

  useEffect(() => {
    setSelectedDateRevenue(new Date());
  }, [selectedPeriodRevenue])

  useEffect(() => {
    if (plantNameToUse) {
      props.getPlantView(plantNameToUse);
      props.getdeviceRealTime(plantNameToUse);
    }
  }, [plantNameToUse]);

  useEffect(() => {
    if (plantNameToUse) {
      if (selectedPeriod !== 'lifetime') { 
        selectedDate && props.getPlantEnergyData(plantNameToUse, selectedPeriod, selectedDate);
      } else {
        props.getPlantEnergyData(plantNameToUse, selectedPeriod, selectedDate);
      }
    }
  }, [selectedPeriod, selectedDate, plantNameToUse]);

  useEffect(() => {
    if (plantNameToUse) {
      if (selectedPeriodRevenue !== 'lifetime') { 
        selectedDateRevenue && props.getPlantRevenue(plantNameToUse, selectedPeriodRevenue, selectedDateRevenue);
      } else {
        props.getPlantRevenue(plantNameToUse, selectedPeriodRevenue, selectedDateRevenue);
      }
    }
  }, [selectedPeriodRevenue, selectedDateRevenue, plantNameToUse]);

  return (
    <div className="plant-monitoring-container">
      {/* Header */}
      <PlantHeader plantName={plantData?.stationInfo?.[0]?.station_name} realtimeInfo={plantData?.realtimeInfo?.[0]??{}}/>

      <EnergyStats 
        plantInfo={plantData.realtimeInfo?.[0]??{}} 
        planInfoBasic={plantData?.basicInfo?.[0]??{}}
        deviceRealTime={props.deviceRealTime?.active_power??''}
      />
      {/* Main Section: Flow (left) + Info (right) */}
      <div className="main-section-card">
        <Row gutter={[0, 0]} className="main-section">
          <Col xs={24} md={24} lg={6} xl={6} className="main-section-left">
            <PlantFlow 
              energyData={plantData.energyData} 
            />
          </Col> 
          <Col xs={24} md={24} lg={18} xl={18} className="main-section-right">
            <PlantInfo 
              plantInfo={plantData?.basicInfo?.[0]??{}}
              alarmCount={plantData?.alarmCount?.[0]??{}}
              envBenefit={plantData?.envBenefit?.[0]??[]}
            />
          </Col>
        </Row>
        {/* Energy Management Panel in Card, Col span=12 */}
      </div>
      <Row gutter={[24, 24]}>
        <Col span={24}>
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
                      <div className="ems-title">Yield: {(props.plantEnergyData?.energy?.sumData?.[0]?.pv_yield || 0).toFixed(2)} <span className="ems-main-unit">kWh</span></div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="ems-sub-row">
                        <span className="ems-sub ems-green">{(props.plantEnergyData?.energy?.sumData?.[0]?.consumed || 0).toFixed(2)}</span>
                        <span className="ems-sub-label">From PV (kWh)</span>
                      </div>
                      <div className="ems-sub-row" style={{ textAlign: 'right' }}>
                        <span className="ems-sub ems-light">{(props.plantEnergyData?.energy?.sumData?.[0]?.feed_to_grid || 0).toFixed(2)}</span>
                        <span className="ems-sub-label">From grid (kWh)</span>
                      </div>
                    </div>
                    {
                      props.plantEnergyData?.energy?.sumData?.[0]?.pv_yield && props.plantEnergyData?.energy?.sumData?.[0]?.feed_to_grid && (
                        <div className="ems-progress-group">
                          <div className="ems-progress-bar ems-progress-green" style={{ width: `${(props.plantEnergyData?.energy?.sumData?.[0]?.consumed / (props.plantEnergyData?.energy?.sumData?.[0]?.pv_yield) * 100).toFixed(2)}%` }}>
                            <span>{(props.plantEnergyData?.energy?.sumData?.[0]?.consumed / (props.plantEnergyData?.energy?.sumData?.[0]?.pv_yield) * 100).toFixed(2)}%</span>
                          </div>
                          <div className="ems-progress-bar ems-progress-light" style={{ width: `${(props.plantEnergyData?.energy?.sumData?.[0]?.feed_to_grid / (props.plantEnergyData?.energy?.sumData?.[0]?.pv_yield) * 100).toFixed(2)}%` }}>
                            <span>{(props.plantEnergyData?.energy?.sumData?.[0]?.feed_to_grid / (props.plantEnergyData?.energy?.sumData?.[0]?.pv_yield) * 100).toFixed(2)}%</span>
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
                  <div
                    className="ems-line-chart-placeholder"
                    style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
                  >
                    <div
                      style={{
                        minWidth: Math.max(
                          500,
                          (props.plantEnergyData?.energy?.detailData?.length || 0) * (typeof window !== 'undefined' && window.innerWidth < 600 ? 100 : 80)
                        ),
                        width: 'fit-content',
                      }}
                    >
                      <Line {...renderCombinedLineConfig(
                        props.plantEnergyData?.energy?.detailData ?? [],
                        props.plantEnergyData?.consumption?.detailData ?? [],
                        selectedPeriod
                      )} />
                    </div>
                  </div>
                </div>
              </div>
            </YieldStatisticsPanel>
          </Card>
        </Col>
        <Col span={24}>
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
                      <div className="ems-title">Sum: {props.plantRevenue?.sumData?.[0]?.total || 0} <span className="ems-main-unit">kWh</span></div>
                    </div>
                  </div>
                </div>
                {/* Chart and legend */}
                <div className="ems-chart-row">
                  <div
                    className="ems-line-chart-placeholder"
                    style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
                  >
                    <div
                      style={{
                        minWidth: Math.max(
                          500,
                          (props.plantRevenue?.detailData?.length || 0) * (typeof window !== 'undefined' && window.innerWidth < 600 ? 100 : 80)
                        ),
                        width: 'fit-content',
                      }}
                    >
                      <Line {...renderRevenueLineConfig(
                        selectedPeriodRevenue === 'lifetime' 
                          ? [
                            {
                              period: "From the beginning",
                              power_profit: props.plantRevenue.sumData?.[0]?.total??0
                            }
                          ]
                          : props.plantRevenue.detailData, 
                          selectedPeriodRevenue)} />
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
