import {
  BarChartOutlined,
  CloseOutlined,
  DollarOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  ExclamationOutlined,
  FieldTimeOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  LineChartOutlined,
  PlusOutlined,
  RightOutlined,
  SettingFilled,
  SettingOutlined,
  TableOutlined,
  ThunderboltOutlined,
  UpOutlined
} from '@ant-design/icons';
import { Bar, Column } from '@ant-design/plots';
import { Button, Checkbox, Col, DatePicker, Input, Popover, Row, Select, Space, Table, Tabs, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import DashboardWidget from '../../components/DashboardWidget';
import FusionSolarLayout from '../../components/HuaweiMenu/FusionSolarLayout';
import './index.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const HuaweiStyleDashboard = () => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [columnSelectorVisible, setColumnSelectorVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    'status',
    'image',
    'name',
    'region',
    'address',
    'connectionDate',
    'stringCapacity',
    'currentPower',
    'specificEnergy',
    'yieldToday',
    'totalYield'
  ]);
  const [selectedParameters, setSelectedParameters] = useState([
    'current_power',
    'yield_today',
    'revenue_today',
    'total_yield',
    'inverter_rated_power'
  ]);

  // State for dashboard panels collapsed state
  const [dashboardCollapsed, setDashboardCollapsed] = useState(false);
  
  // State for view mode (table or graph)
  const [viewMode, setViewMode] = useState('table');

  // Add this state for the date picker
  const [selectedDate, setSelectedDate] = useState(null);

  // Add state for selected period
  const [selectedPeriod, setSelectedPeriod] = useState('day');

  // Toggle dashboard collapsed state
  const toggleDashboard = () => {
    setDashboardCollapsed(!dashboardCollapsed);
  };
  
  // Toggle view mode
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // All available parameters
  const allParameters = [
    { id: 'current_power', label: 'Current power' },
    { id: 'yield_today', label: 'Yield today' },
    { id: 'revenue_today', label: 'Revenue today' },
    { id: 'total_yield', label: 'Total yield' },
    { id: 'inverter_rated_power', label: 'Inverter rated power' },
    { id: 'rated_ess_capacity', label: 'Rated ESS capacity', category: 'Energy Storage Scenario' },
    { id: 'energy_charged_today', label: 'Energy charged today', category: 'Energy Storage Scenario' },
    { id: 'energy_discharged_today', label: 'Energy discharged today', category: 'Energy Storage Scenario' },
    { id: 'total_energy_charged', label: 'Total energy charged', category: 'Energy Storage Scenario' },
    { id: 'total_energy_discharged', label: 'Total energy discharged', category: 'Energy Storage Scenario' }
  ];

  const handleParameterChange = (paramId) => {
    if (selectedParameters.includes(paramId)) {
      // If already selected, remove it
      setSelectedParameters(selectedParameters.filter(id => id !== paramId));
    } else {
      // If not selected and we have less than 6 parameters, add it
      if (selectedParameters.length < 6) {
        setSelectedParameters([...selectedParameters, paramId]);
      }
    }
  };

  const handleConfirm = () => {
    // Add logic to apply the parameter changes
    setPopoverVisible(false);
  };

  const handleCancel = () => {
    setPopoverVisible(false);
  };

  const handleRestore = () => {
    setSelectedParameters([
      'current_power',
      'yield_today',
      'revenue_today',
      'total_yield',
      'inverter_rated_power'
    ]);
  };

  // Parameter Selection Content for Popover
  const parameterSelectionContent = (
    <div className="parameter-selection-content">
      <div className="parameter-card-header">
        <Title level={5}>Parameter Selection</Title>
        <CloseOutlined className="close-icon" onClick={handleCancel} />
      </div>
      
      <div className="parameter-list">
        {allParameters.filter(param => !param.category).map(param => (
          <div key={param.id} className="parameter-item">
            <Checkbox 
              checked={selectedParameters.includes(param.id)}
              onChange={() => handleParameterChange(param.id)}
            >
              {param.label}
            </Checkbox>
          </div>
        ))}
        
        <div className="parameter-category">
          <Text strong>Energy Storage Scenario</Text>
        </div>
        
        {allParameters.filter(param => param.category === 'Energy Storage Scenario').map(param => (
          <div key={param.id} className="parameter-item">
            <Checkbox 
              checked={selectedParameters.includes(param.id)}
              onChange={() => handleParameterChange(param.id)}
            >
              {param.label}
            </Checkbox>
          </div>
        ))}
      </div>
      
      <div className="selection-hint">
        <Text type="secondary">
          <InfoCircleOutlined /> Select four to six parameters.
        </Text>
      </div>
      
      <div className="parameter-card-footer">
        <Space>
          <Button onClick={handleRestore}>Restore ...</Button>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button 
            type="primary" 
            onClick={handleConfirm}
            disabled={selectedParameters.length < 4 || selectedParameters.length > 6}
          >
            Confirm
          </Button>
        </Space>
      </div>
    </div>
  );

  // Updated data for Plant KPIs widget
  const kpiData = [
    {
      id: 'current_power',
      value: '0.00',
      unit: 'kW',
      label: 'Current power',
      icon: <LineChartOutlined />,
    },
    {
      id: 'yield_today',
      value: '6.58',
      unit: 'MWh',
      label: 'Yield today',
      icon: <FieldTimeOutlined />,
    },
    {
      id: 'revenue_today',
      value: '21.65K',
      unit: '',
      label: 'Revenue today',
      icon: <DollarOutlined />,
    },
    {
      id: 'total_yield',
      value: '607.15',
      unit: 'MWh',
      label: 'Total yield',
      icon: <FieldTimeOutlined />,
    },
    {
      id: 'inverter_rated_power',
      value: '1.89',
      unit: 'MW',
      label: 'Inverter rated power',
      icon: <ThunderboltOutlined />,
    }
  ].filter(item => selectedParameters.includes(item.id));

  // Data for Plant Status widget
  const plantStatusData = [
    { type: 'Normal', value: 301 },
    { type: 'Faulty', value: 1 },
    { type: 'Disconnected', value: 14 }
  ];

  const plantStatusItems = [
    { count: 301, label: 'Normal', icon: <span className="status-dot normal" /> },
    { count: 1, label: 'Faulty', icon: <span className="status-dot faulty" /> },
    { count: 14, label: 'Disconnected', icon: <span className="status-dot disconnected" /> }
  ];

  const plantStatusInnerContent = (
    <>
      <Title level={2}>316</Title>
      <div className="chart-label">Total plants</div>
    </>
  );

  // Data for Active Alarms widget with all alarm types represented
  const alarmStatusData = [
    { type: 'Critical', value: 0 },
    { type: 'Major', value: 13 },
    { type: 'Minor', value: 0 },
    { type: 'Warning', value: 0 }
  ];

  const alarmStatusItems = [
    { count: 0, label: 'Critical', icon: <div className="alarm-icon critical"><ExclamationCircleOutlined /></div> },
    { count: 13, label: 'Major', icon: <div className="alarm-icon major"><ThunderboltOutlined /></div> },
    { count: 0, label: 'Minor', icon: <div className="alarm-icon minor"><ExclamationOutlined /></div> },
    { count: 0, label: 'Warning', icon: <div className="alarm-icon warning"><InfoCircleOutlined /></div> }
  ];

  const alarmStatusInnerContent = (
    <>
      <Title level={2}>13</Title>
      <div className="chart-label">Total alarms</div>
    </>
  );

  // Plant List Table Data
  const plantTableColumns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: status => (
        <div className={`status-indicator ${status === 'normal' ? 'normal' : status === 'faulty' ? 'faulty' : 'disconnected'}`} />
      )
    },
    {
      title: 'Plant Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: imgUrl => <img src={imgUrl} alt="Plant" className="plant-thumbnail" />
    },
    {
      title: 'Plant Name',
      dataIndex: 'name',
      key: 'name',
      render: name => <a className="plant-name-link">{name}</a>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Country/Region',
      dataIndex: 'region',
      key: 'region',
      sorter: (a, b) => a.region.localeCompare(b.region),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Grid Connection Date',
      dataIndex: 'connectionDate',
      key: 'connectionDate',
      sorter: (a, b) => new Date(a.connectionDate) - new Date(b.connectionDate),
    },
    {
      title: 'Total String Capacity (kW)',
      dataIndex: 'stringCapacity',
      key: 'stringCapacity',
      sorter: (a, b) => a.stringCapacity - b.stringCapacity,
    },
    {
      title: 'Current Power (kW)',
      dataIndex: 'currentPower',
      key: 'currentPower',
      sorter: (a, b) => a.currentPower - b.currentPower,
    },
    {
      title: 'Specific Energy (kWh/kWp)',
      dataIndex: 'specificEnergy',
      key: 'specificEnergy',
      sorter: (a, b) => a.specificEnergy - b.specificEnergy,
    },
    {
      title: 'Yield Today (kWh)',
      dataIndex: 'yieldToday',
      key: 'yieldToday',
      sorter: (a, b) => a.yieldToday - b.yieldToday,
    },
    {
      title: 'Total Yield (kWh)',
      dataIndex: 'totalYield',
      key: 'totalYield',
      sorter: (a, b) => a.totalYield - b.totalYield,
      render: (text) => (
        <Space>
          {text}
          <Tooltip title="Total energy generated since the plant was installed">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      )
    },
  ];

  const plantTableData = [
    {
      key: '1',
      status: 'normal',
      image: 'https://via.placeholder.com/60x40',
      name: 'LEE4453_Kan Kwok Leong',
      region: 'Malaysia',
      address: 'SelangorPetaling JayaSS2',
      connectionDate: '2025-04-30',
      stringCapacity: 4.590,
      currentPower: 0.00,
      specificEnergy: 1.06,
      yieldToday: 4.86,
      totalYield: 9.01
    },
    {
      key: '2',
      status: 'normal',
      image: 'https://via.placeholder.com/60x40',
      name: 'LEE6480–Hairil Anwar',
      region: 'Malaysia',
      address: 'Malaysia, Selangor, Shah Alam',
      connectionDate: '2025-04-30',
      stringCapacity: 12.240,
      currentPower: 0.00,
      specificEnergy: 2.47,
      yieldToday: 30.19,
      totalYield: 56.32
    },
    {
      key: '3',
      status: 'normal',
      image: 'https://via.placeholder.com/60x40',
      name: 'LEE5730 BUDIYANTO',
      region: 'Malaysia',
      address: 'SelangorBantingTanjong Dua Belas',
      connectionDate: '2025-04-30',
      stringCapacity: 6.630,
      currentPower: 0.00,
      specificEnergy: 3.48,
      yieldToday: 23.07,
      totalYield: 46.86
    },
    {
      key: '4',
      status: 'normal',
      image: 'https://via.placeholder.com/60x40',
      name: 'LEE5555–Jawaria',
      region: 'Malaysia',
      address: '47000 Shah Alam, Selangor, Malaysia',
      connectionDate: '2025-04-30',
      stringCapacity: 4.590,
      currentPower: 0.00,
      specificEnergy: 1.43,
      yieldToday: 6.55,
      totalYield: 17.02
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  // Columns selection handler
  const handleColumnSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedColumns(plantTableColumns.map(col => col.key || col.dataIndex));
    } else {
      setSelectedColumns([]);
    }
  };

  const handleColumnSelect = (columnKey) => {
    if (selectedColumns.includes(columnKey)) {
      setSelectedColumns(selectedColumns.filter(key => key !== columnKey));
    } else {
      setSelectedColumns([...selectedColumns, columnKey]);
    }
  };

  // Column selection content for Popover
  const columnSelectionContent = (
    <div className="parameter-selection-content">
      <div className="parameter-card-header">
        <Title level={5}>Select Columns</Title>
        <CloseOutlined className="close-icon" onClick={() => setColumnSelectorVisible(false)} />
      </div>
      
      <div className="parameter-list">
        <div className="parameter-item">
          <Checkbox 
            checked={selectedColumns.length === plantTableColumns.length}
            indeterminate={selectedColumns.length > 0 && selectedColumns.length < plantTableColumns.length}
            onChange={handleColumnSelectAll}
          >
            Select all
          </Checkbox>
        </div>
        
        {plantTableColumns.map(column => (
          <div key={column.key || column.dataIndex} className="parameter-item">
            <Checkbox 
              checked={selectedColumns.includes(column.key || column.dataIndex)}
              onChange={() => handleColumnSelect(column.key || column.dataIndex)}
            >
              {column.title}
            </Checkbox>
          </div>
        ))}
      </div>
      
      <div className="parameter-card-footer">
        <Space>
          <Button onClick={() => {
            setSelectedColumns(plantTableColumns.map(col => col.key || col.dataIndex));
            setColumnSelectorVisible(false);
          }}>Restore</Button>
          <Button onClick={() => setColumnSelectorVisible(false)}>Cancel</Button>
          <Button 
            type="primary" 
            onClick={() => setColumnSelectorVisible(false)}
          >
            OK
          </Button>
        </Space>
      </div>
    </div>
  );

  // Modified plantTableColumns to only include selected columns
  const visibleColumns = plantTableColumns.filter(column => 
    selectedColumns.includes(column.key || column.dataIndex)
  );

  return (
    <FusionSolarLayout>
      <div className="huawei-dashboard">
        <div className="dashboard-controls">
          {/* <div className="nav-button">
            <i className="anticon">
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </i>
          </div> */}
          <div 
            className={`nav-button ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => toggleViewMode('table')}
          >
            <i className="anticon">
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
                <path d="M3 17h18v2H3v-2zm0-7h18v2H3v-2zm0-7h18v2H3V3z"/>
              </svg>
            </i>
          </div>
          <div 
            className={`nav-button ${viewMode === 'graph' ? 'active' : ''}`}
            onClick={() => toggleViewMode('graph')}
          >
            <BarChartOutlined />
          </div>
          <button 
            className="collapse-toggle" 
            onClick={toggleDashboard}
            aria-label={dashboardCollapsed ? "Expand Dashboard" : "Collapse Dashboard"}
          >
            {dashboardCollapsed ? <DownOutlined /> : <UpOutlined />}
          </button>
        </div>
        
        <div className={`dashboard-widgets ${dashboardCollapsed ? 'collapsed' : ''}`}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <div className="dashboard-panel plant-kpi-panel transparent-panel">
                <div className="panel-header">
                  <div className="title-with-settings">
                    <Title level={4}>Plant KPIs</Title>
                    <Popover
                      content={parameterSelectionContent}
                      trigger="click"
                      visible={popoverVisible}
                      onVisibleChange={setPopoverVisible}
                      placement="bottomLeft"
                      overlayClassName="parameter-popover"
                    >
                      <SettingOutlined className="settings-icon" />
                    </Popover>
                  </div>
                </div>
                <div className="panel-content">
                  <Row gutter={[16, 12]}>
                    {kpiData.map((item, index) => (
                      <Col span={12} key={index}>
                        <div className="kpi-item">
                          <div className="kpi-icon">
                            {item.icon}
                          </div>
                          <div className="kpi-data">
                            <div className="kpi-value">
                              {item.value} <span className="kpi-unit">{item.unit}</span>
                            </div>
                            <div className="kpi-label">{item.label}</div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <DashboardWidget
                title="Plant Status"
                chartData={plantStatusData}
                chartColors={['#52c41a', '#ff4d4f', '#d9d9d9']}
                chartInnerContent={plantStatusInnerContent}
                items={plantStatusItems}
                onViewMore={() => {}}
                transparent={true}
                rightIcon={<RightOutlined />}
              />
            </Col>
            
            <Col xs={24} md={8}>
              <DashboardWidget
                title="Active Alarms"
                chartData={alarmStatusData}
                chartColors={['#f5222d', '#fa8c16', '#faad14', '#1890ff']}
                chartInnerContent={alarmStatusInnerContent}
                items={alarmStatusItems}
                onViewMore={() => {}}
                transparent={true}
                rightIcon={<RightOutlined />}
              />
            </Col>
          </Row>
        </div>
        
        {viewMode === 'table' ? (
          <Row gutter={[16, 16]}>
            <Col xs={24} className="white-background-panel">
              <div className="plant-list-panel">
                <div className="plant-list-header">
                  <div className="search-filters">
                    <div className="filter-item">
                      <label>Plant name</label>
                      <Input placeholder="Plant name" />
                    </div>
                    <div className="filter-item">
                      <label>Country/Region</label>
                      <Input placeholder="Country/Region" />
                    </div>
                    <div className="filter-item">
                      <label>Device type</label>
                      <Select defaultValue="All" style={{ width: '100%' }}>
                        <Option value="All">All</Option>
                        <Option value="SUN2000">SUN2000</Option>
                        <Option value="SUN8000">SUN8000</Option>
                      </Select>
                    </div>
                    <div className="filter-item">
                      <label>Device SN</label>
                      <Input placeholder="Device SN" />
                    </div>
                  </div>
                  <div className="action-buttons">
                    <div className="expand-button">
                      <Button type="default">Expand</Button>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />}>Add Plant</Button>
                  </div>
                </div>
                
                <div className="search-actions">
                  <Button type="primary">Search</Button>
                  <Button>Reset</Button>
                  <div className="settings-button">
                    <Popover
                      content={columnSelectionContent}
                      trigger="click"
                      visible={columnSelectorVisible}
                      onVisibleChange={setColumnSelectorVisible}
                      placement="bottomRight"
                      overlayClassName="parameter-popover"
                    >
                      <SettingFilled />
                    </Popover>
                  </div>
                </div>
                
                <Table 
                  columns={visibleColumns} 
                  dataSource={plantTableData}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: 316,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: (total) => `Total records: ${total}`
                  }}
                  onChange={handleTableChange}
                  scroll={{ x: 'max-content' }}
                  className="plant-list-table"
                />
              </div>
            </Col>
          </Row>
        ) : (
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
                      <span className="legend-text">Yield</span>
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
                            { plant: 'LEE2390_AHAM...', value: 3.56 },
                            { plant: 'LEE1725_Aziz...', value: 1.88 },
                            { plant: 'LEE3126 CHEN...', value: 1.83 },
                            { plant: 'LEE1940_Zain...', value: 1.81 },
                            { plant: 'LEE1566_Foo...', value: 1.80 }
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
        )}
      </div>
    </FusionSolarLayout>
  );
};

export default HuaweiStyleDashboard; 