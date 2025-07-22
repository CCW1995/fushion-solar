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
import WithPlantView from './action';
import LoadingOverlay from 'components/Indicator/LoadingOverlay';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';

// Helper to process revenue data for recharts
const getRevenueChartData = (plantRevenue, selectedPeriodRevenue) => {
  if (selectedPeriodRevenue === 'lifetime') {
    return [
      {
        period: 'From the beginning',
        power_profit: plantRevenue.sumData?.[0]?.total ?? 0,
      },
    ];
  }
  return (plantRevenue.detailData || []).map(item => ({
    period:
      selectedPeriodRevenue === 'monthly'
        ? moment(item.period).format('MM/DD')
        : selectedPeriodRevenue === 'yearly'
        ? moment(item.period).format('MM/YYYY')
        : item.period,
    power_profit: item.power_profit,
  }));
};

// Helper to process energy/consumption data for recharts
const getEnergyChartData = (energyData, consumptionData, selectedPeriod) => {
  // Merge by period
  const periodFormat = (period) =>
    selectedPeriod === 'lifetime'
      ? moment(period).format('YYYY')
      : selectedPeriod === 'monthly'
      ? moment(period).format('MM/DD')
      : selectedPeriod === 'yearly'
      ? moment(period).format('MM/YYYY')
      : selectedPeriod === 'daily'
      ? moment(period).format('HH:mm')
      : period;
  const energyMap = (energyData || []).reduce((acc, item) => {
    const key = periodFormat(item.period);
    acc[key] = {
      ...(acc[key] || {}),
      period: key,
      inverter_power: item.inverter_power,
    };
    return acc;
  }, {});
  (consumptionData || []).forEach(item => {
    const key = periodFormat(item.period);
    if (!energyMap[key]) energyMap[key] = { period: key };
    energyMap[key] = {
      ...energyMap[key],
      total_consumption: item.total_consumption,
      from_pv: item.from_pv,
    };
  });
  return Object.values(energyMap);
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

  const energyChartData = getEnergyChartData(
    props.plantEnergyData?.energy?.detailData ?? [],
    props.plantEnergyData?.consumption?.detailData ?? [],
    selectedPeriod
  );

  const revenueChartData = getRevenueChartData(props.plantRevenue, selectedPeriodRevenue);

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
                      className="responsive-chart-container"
                      style={{
                        minWidth: Math.max(500, energyChartData.length * 60),
                        width: '100%',
                      }}
                    >
                      {selectedPeriod !== 'daily' ? (
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart
                            data={energyChartData}
                            margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="inverter_power" name="Inverter Power" fill="#2C3E50" />
                            <Bar dataKey="total_consumption" name="Total Consumption" fill="#2980B9" />
                            <Bar dataKey="from_pv" name="From PV" fill="#7F8C8D" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart
                            data={energyChartData}
                            margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="inverter_power" name="Inverter Power" stroke="#2C3E50" />
                            <Line type="monotone" dataKey="total_consumption" name="Total Consumption" stroke="#2980B9" />
                            <Line type="monotone" dataKey="from_pv" name="From PV" stroke="#7F8C8D" />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
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
                      className="responsive-chart-container"
                      style={{
                        minWidth: Math.max(500, revenueChartData.length * 60),
                        width: '100%',
                      }}
                    >
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                          data={revenueChartData}
                          margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="power_profit" name="Power Profit" fill="#34495E" />
                        </BarChart>
                      </ResponsiveContainer>
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
