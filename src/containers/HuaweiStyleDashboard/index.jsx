import {
  BarChartOutlined,
  CloseOutlined,
  DownOutlined,
  InfoCircleOutlined,
  RightOutlined,
  SettingOutlined,
  UpOutlined
} from '@ant-design/icons';
import { Button, Checkbox, Col, Popover, Row, Space, Typography } from 'antd';
import React, { useState } from 'react';
import DashboardWidget from '../../components/DashboardWidget';
import GraphContent from './GraphContent';
import TableContent from './TableContent';
import {
  alarmStatusData, alarmStatusItems, allParameters,
  plantStatusData, plantStatusItems, plantTableColumns,
  renderKpi
} from './assets.jsx';
import './index.scss';

const { Title, Text } = Typography;

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

  const [currentPage, setCurrentPage] = useState(1);
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

  // Modified plantTableColumns to only include selected columns
  const visibleColumns = plantTableColumns.filter(column => 
    selectedColumns.includes(column.key || column.dataIndex)
  );

  return (
    <>
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
                    {renderKpi(selectedParameters).map((item, index) => (
                      <Col xs={24} md={12} key={index}>
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
                chartInnerContent={
                  <>
                    <Title level={2}>316</Title>
                    <div className="chart-label">Total plants</div>
                  </>
                }
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
                chartInnerContent={
                  <>
                    <Title level={2}>13</Title>
                    <div className="chart-label">Total alarms</div>
                  </>
                }
                items={alarmStatusItems}
                onViewMore={() => {}}
                transparent={true}
                rightIcon={<RightOutlined />}
              />
            </Col>
          </Row>
        </div>
        
        {viewMode === 'table' ? (
          <TableContent 
            selectedColumns={selectedColumns}
            handleColumnSelectAll={handleColumnSelectAll}
            setSelectedColumns={setSelectedColumns}
            columnSelectorVisible={columnSelectorVisible}
            setColumnSelectorVisible={setColumnSelectorVisible}
            visibleColumns={visibleColumns}
            currentPage={currentPage}
            handleTableChange={handleTableChange}
          />
        ) : (
          <GraphContent
            setSelectedPeriod={setSelectedPeriod}
            selectedPeriod={selectedPeriod}
            selectedDate={selectedDate}
            handleColumnSelect={handleColumnSelect}
            setSelectedDate={setSelectedDate}
          />
        )}
      </div>
    </>
  );
};

export default HuaweiStyleDashboard; 