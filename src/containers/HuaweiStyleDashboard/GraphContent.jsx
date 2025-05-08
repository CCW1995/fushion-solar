import {
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { Bar, Column } from '@ant-design/plots';
import { Button, Col, DatePicker, Row, Select, Tabs, Typography } from 'antd';
import React from 'react';
import './index.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

function GraphContent({
  setSelectedPeriod,
  selectedPeriod,
  selectedDate,
  setSelectedDate
}) {
  return (
    <>
       <Row gutter={[16, 16]} className="graph-dashboard">
            <Col xs={24} md={12} className="graph-panel">
              <div className="dashboard-panel transparent-panel" style={{ height: 'max-content' }}>
                <div className="panel-header flex-wrap">
                  <div className="title-with-settings">
                    <Title level={4}>Yield Statistics</Title>
                  </div>
                  <div className="panel-actions ml-auto">
                    <div className="period-tabs" style={{ marginLeft: 'auto' }}>
                      <Button.Group>
                        <Button 
                          type={selectedPeriod === 'day' ? "primary" : "default"} 
                          onClick={() => setSelectedPeriod('day')}
                        >
                          Day
                        </Button>
                        <Button 
                          type={selectedPeriod === 'month' ? "primary" : "default"} 
                          onClick={() => setSelectedPeriod('month')}
                        >
                          Month
                        </Button>
                        <Button 
                          type={selectedPeriod === 'year' ? "primary" : "default"} 
                          onClick={() => setSelectedPeriod('year')}
                        >
                          Year
                        </Button>
                        <Button 
                          type={selectedPeriod === 'lifetime' ? "primary" : "default"} 
                          onClick={() => setSelectedPeriod('lifetime')}
                        >
                          Lifetime
                        </Button>
                      </Button.Group>
                      <DatePicker 
                        value={selectedDate || null}
                        onChange={(date) => setSelectedDate(date)}
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
                    <Column
                      data={[
                        { hour: '00', value: 0 },
                        { hour: '01', value: 0 },
                        { hour: '02', value: 0 },
                        { hour: '03', value: 0 },
                        { hour: '04', value: 0 },
                        { hour: '05', value: 0 },
                        { hour: '06', value: 0 },
                        { hour: '07', value: 45 },
                        { hour: '08', value: 180 },
                        { hour: '09', value: 380 },
                        { hour: '10', value: 590 },
                        { hour: '11', value: 1100 },
                        { hour: '12', value: 980 },
                        { hour: '13', value: 1050 },
                        { hour: '14', value: 950 },
                        { hour: '15', value: 670 },
                        { hour: '16', value: 380 },
                        { hour: '17', value: 150 },
                        { hour: '18', value: 0 },
                        { hour: '19', value: 0 },
                        { hour: '20', value: 0 },
                        { hour: '21', value: 0 },
                        { hour: '22', value: 0 },
                        { hour: '23', value: 0 }
                      ]}
                      xField="hour"
                      yField="value"
                      columnWidthRatio={0.6}
                      columnStyle={{
                        fill: '#52c41a',
                        radius: [2, 2, 0, 0]
                      }}
                      yAxis={{
                        title: {
                          text: 'kWh',
                          style: {
                            fontSize: 14,
                            color: 'rgba(0, 0, 0, 0.45)'
                          }
                        },
                        grid: {
                          line: {
                            style: {
                              stroke: 'rgba(0, 0, 0, 0.05)',
                              lineDash: [4, 0]
                            }
                          }
                        },
                        tickInterval: 300,
                        max: 1500,
                        label: {
                          formatter: (text) => text
                        }
                      }}
                      xAxis={{
                        tickCount: 24,
                        line: {
                          style: {
                            stroke: 'rgba(0, 0, 0, 0.05)'
                          }
                        }
                      }}
                      //tooltip={{
                        //  showTitle: false,
                        //formatter: (datum) => {
                          //return { name: 'Yield', value: `${datum.value} kWh` };
                        //}
                      //}}
                      interactions={[
                        {
                          type: 'element-active'
                        }
                      ]}
                      height={400}
                      autoFit={false}
                      padding={[30, 20, 60, 60]}
                      appendPadding={[0, 0, 20, 0]}
                    />
                  </div>
                  <div className="time-slider">
                    <div className="slider-track"></div>
                  </div>
                </div>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <div className="dashboard-panel transparent-panel">
                    <div className="panel-header">
                      <div className="title-with-settings">
                        <Title level={4}>Today's Plant Ranking (Specific Energy)</Title>
                      </div>
                    </div>
                    <div className="panel-content">
                      <div className="ranking-list">
                        <Bar
                          data={[
                            { plant: 'LEE2390_AHAM...', value: 0 },
                            { plant: 'LEE1725_Aziz...', value: 0 },
                            { plant: 'LEE3126 CHEN...', value: 0 },
                            { plant: 'LEE1940_Zain...', value: 0 },
                            { plant: 'LEE1566_Foo...', value: 0 }
                          ]}
                          xField="plant"
                          yField="value"
                          seriesField="value"
                          legend={false}
                          columnWidthRatio={0.6}
                          colorField={'plant'}
                          barStyle={{
                            fill: '#1890ff',
                            radius: [4, 4, 0, 0]
                          }}
                          maxColumnWidth={100}
                          minColumnWidth={50}
                          xAxis={{
                            label: {
                              style: {
                                fill: 'rgba(0, 0, 0, 0.85)',
                                fontSize: 14
                              }
                            },
                            grid: null,
                            line: null
                          }}
                          yAxis={{
                            label: {
                              style: {
                                fill: 'rgba(0, 0, 0, 0.45)',
                                fontSize: 12
                              },
                              formatter: (text) => `${text} kWh/kWp`
                            },
                            grid: {
                              line: {
                                style: {
                                  stroke: 'rgba(0, 0, 0, 0.06)',
                                  lineDash: [0, 0]
                                }
                              }
                            }
                          }}
                          height={200}
                          interactions={[
                            {
                              type: 'element-active'
                            }
                          ]}
                          animation={{
                            appear: {
                              animation: 'wave-in',
                              duration: 1000
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                
                <Col xs={24}>
                  <div className="dashboard-panel transparent-panel">
                    <div className="panel-header">
                      <div className="title-with-settings">
                        <Title level={4}>Environmental Benefits</Title>
                      </div>
                    </div>
                    <div className="panel-content">
                      <div className="benefits-container">
                        <div className="benefit-item">
                          <div className="benefit-icon standard-coal"></div>
                          <div className="benefit-value">249.27 (tons)</div>
                          <div className="benefit-label">Standard coal equivalent</div>
                        </div>
                        <div className="benefit-item">
                          <div className="benefit-icon co2"></div>
                          <div className="benefit-value">296.01 (tons)</div>
                          <div className="benefit-label">CO₂ emission reduction</div>
                        </div>
                        <div className="benefit-item">
                          <div className="benefit-icon trees"></div>
                          <div className="benefit-value">580</div>
                          <div className="benefit-label">Equivalent to planting trees</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
    </>
  )
}

export default GraphContent