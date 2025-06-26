import React, { useState, useEffect } from 'react';
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
import { renderLineConfig, renderRevenueLineConfig } from './assets';

const PlantMonitoringView = (props) => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedPeriodRevenue, setSelectedPeriodRevenue] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateRevenue, setSelectedDateRevenue] = useState(new Date());

  const {plantData} = props

  const stationVal = props.data.ProfileReducer?.profile?.role.name === 'Admin' 
    ? props.data.SiteReducer?.selectedSite
    : props.data.StationReducer?.station_name

  useEffect(() => {
    setSelectedDate(new Date());
  }, [selectedPeriod])

  useEffect(() => {
    setSelectedDateRevenue(new Date());
  }, [selectedPeriodRevenue])

  useEffect(() => {
    //data.SiteReducer.selectedSite
    if (stationVal) {
      props.getPlantView(stationVal);
    }
  }, [props.data]);

  useEffect(() => {
    if (stationVal) {
      props.getPlantEnergyData(stationVal, selectedPeriod, selectedDate);
    }
  }, [selectedPeriod, selectedDate]);

  useEffect(() => {
    if (stationVal) {
      props.getPlantRevenue(stationVal, selectedPeriodRevenue, selectedDateRevenue);
    }
  }, [selectedPeriodRevenue, selectedDateRevenue]);

  return (    
    <>
      {
        stationVal && (
          <div className="plant-monitoring-container">
            {/* Header */}
            <PlantHeader plantName={plantData?.stationInfo?.[0]?.station_name}/>
      
            <EnergyStats plantInfo={plantData.realtimeInfo?.[0]??{}} planInfoBasic={plantData?.basicInfo?.[0]??{}}/>
      
            {/* Main Section: Flow (left) + Info (right) */}
            <div className="main-section-card">
              <Row gutter={[0, 0]} className="main-section">
                <Col xs={24} md={6} className="main-section-left">
                  <PlantFlow 
                    energyData={plantData.energyData} 
                  />
                </Col> 
                <Col xs={24} md={18} className="main-section-right">
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
                            <div className="ems-title">Yield: {(props.plantEnergyData?.energy?.sumData?.[0]?.pv_yield || 0).toFixed(2)} <span className="ems-main-unit">kWh</span></div>
                          </div>
                          <div className="ems-chart-row">
                            <div className="ems-line-chart-placeholder" style={{ overflowX: 'auto', minWidth: 0 }}>
                              <div style={{ minWidth: Math.max(500, (props.plantEnergyData?.energy?.detailData?.length || 0) * 60) }}>
                                <Line {...renderLineConfig(props.plantEnergyData?.energy?.detailData??[], selectedPeriod)} />
                              </div>
                            </div>
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
                            <div className="ems-title">Sum: {props.plantRevenue?.sumData?.[0]?.total || 0} <span className="ems-main-unit">kWh</span></div>
                          </div>
                        </div>
                      </div>
                      {/* Chart and legend */}
                      <div className="ems-chart-row">
                        <div className="ems-line-chart-placeholder" style={{ overflowX: 'auto', minWidth: 0 }}>
                          <div style={{ minWidth: Math.max(500, (props.plantRevenue?.graphData?.length || 0) * 60) }}>
                            <Line {...renderRevenueLineConfig(props.plantRevenue.detailData, selectedPeriodRevenue)} />
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
        )
      }
    
    </>
  );
};

export default WithPlantView(PlantMonitoringView);
