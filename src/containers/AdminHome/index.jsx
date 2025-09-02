import {
  CloseOutlined,
  InfoCircleOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { Button, Checkbox, Col, Row, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import DashboardWidget from '../../components/DashboardWidget';
import GraphContent from './GraphContent';
import TableContent from './TableContent';
import HOC from './actions';
import {
  allParameters,
  getPlantTableColumns,
  renderKpi
} from './assets.jsx';
import './index.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const { Title, Text } = Typography;

const HuaweiStyleDashboard = (props) => {
  const history = useHistory();
  
  // Dashboard state
  const [dashboardCollapsed, setDashboardCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  
  // Filter and search state
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [inverterBrand, setInverterBrand] = useState('');
  const [inverterBrandStatus, setInverterBrandStatus] = useState('');
  const [inverterBrandAlarm, setInverterBrandAlarm] = useState('');
  const [inverterBrandEnergy, setInverterBrandEnergy] = useState('');
  const [purchaseType, setPurchaseType] = useState('');
  
  // Column selection state
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
  
  // Parameter selection state
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedParameters, setSelectedParameters] = useState([
    'current_power',
    'yield_today',
    'revenue_today',
    'total_yield',
    'inverter_rated_power'
  ]);
  
  // Date and period state
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  
  // Today's date for energy API
  const today = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
  
  // Half annual energy date filter
  const [energyDateFilter, setEnergyDateFilter] = useState(today);
  
  // Get the plant table columns with navigation function
  const plantTableColumns = getPlantTableColumns(history.push);
  
  // Inverter brand options for Plant Status widget
  const inverterBrandOptions = [
    { value: '', label: '--' },
    { value: 'fusionsolar', label: 'fusionsolar' },
    { value: 'soliscloud', label: 'soliscloud' },
    { value: 'sungrow', label: 'sungrow' },
    { value: 'goodwe', label: 'goodwe' },
    { value: 'growatt', label: 'growatt' }
  ];
  
  useEffect(() => {
    const userProfile = props.data.ProfileReducer.profile;
    const isAdmin = userProfile?.role?.name === 'Admin';
    
    if (isAdmin) {
      props.getKpi();
      props.getDeviceAlarm(inverterBrandAlarm);
      props.getDeviceStatus(inverterBrandStatus);
      props.getHalfAnnualEnergy(energyDateFilter, inverterBrandEnergy);
      props.getStationList('', 1, 10, '', purchaseType);  
    } else {
      history.push('/dashboard/plant-monitoring');
    }
  }, []);
  
  // Dashboard control handlers
  const toggleDashboard = () => {
    setDashboardCollapsed(!dashboardCollapsed);
  };
  
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  const handleAlarmClick = () => {
    history.push('/dashboard/alarm-listing');
  };

  // Parameter selection handlers
  const handleParameterChange = (paramId) => {
    if (selectedParameters.includes(paramId)) {
      setSelectedParameters(selectedParameters.filter(id => id !== paramId));
    } else if (selectedParameters.length < 6) {
      setSelectedParameters([...selectedParameters, paramId]);
    }
  };

  const handleConfirm = () => {
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

  // Table handlers
  const handleTableChange = (pagination, filters, sorter) => {
    const newPage = pagination.current;
    const newPageSize = pagination.pageSize;
    
    setCurrentPage(newPage);
    setPageSize(newPageSize);
    
    props.getStationList(searchName, newPage, newPageSize, inverterBrand, purchaseType);
  };

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

  useEffect(() => {
    //searchName && props.getStationList(searchName, 1, pageSize);
  }, [searchName]);

  return (
    <>
      <div className="home">
        <div className="dashboard-controls">
          {/* <div className="nav-button">
            <i className="anticon">
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </i>
          </div> */}
          {/* <div 
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
          </div> */}
          {/* <button 
            className="collapse-toggle" 
            onClick={toggleDashboard}
            aria-label={dashboardCollapsed ? "Expand Dashboard" : "Collapse Dashboard"}
          >
            {dashboardCollapsed ? <DownOutlined /> : <UpOutlined />}
          </button> */}
        </div>
        
        <div className={`dashboard-widgets ${dashboardCollapsed ? 'collapsed' : ''}`}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <div className="dashboard-panel plant-kpi-panel transparent-panel">
                <div className="panel-header">
                  <div className="title-with-settings">
                    <Title level={4}>Plant KPIs</Title>
                    {/* <Popover
                      content={parameterSelectionContent}
                      trigger="click"
                      visible={popoverVisible}
                      onVisibleChange={setPopoverVisible}
                      placement="bottomLeft"
                      overlayClassName="parameter-popover"
                    >
                      <SettingOutlined className="settings-icon" />
                    </Popover> */}
                  </div>
                </div>
                <div className="panel-content">
                  <Row gutter={[16, 12]}>
                    {renderKpi().map((item, index) => (
                      <Col xs={24} md={12} key={index}>
                        <div className="kpi-item">
                          <div className="kpi-icon">
                            {item.icon}
                          </div>
                          <div className="kpi-data">
                            <div className="kpi-value">
                              {props.kpiData[item.id] || 0} <span className="kpi-unit">{item.unit}</span>
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
                chartData={props.deviceStatusData}
                chartColors={['#52c41a', '#ff4d4f', '#d9d9d9']}
                chartInnerContent={
                  <>
                    <Title level={2}>{props.deviceStatusTotal}</Title>
                    <div className="chart-label">Total plants</div>
                  </>
                }
                items={props.deviceStatusData}
                onViewMore={() => {}}
                transparent={true}
                rightIcon={<></>}
                showFilter={true}
                filterOptions={inverterBrandOptions}
                filterValue={inverterBrandStatus}
                onFilterChange={(value) => {
                  setInverterBrandStatus(value);
                  props.getDeviceStatus(value);
                }}
                filterPlaceholder="Select brand"
              />
            </Col>
            
            <Col xs={24} md={8}>
              <DashboardWidget
                title="Active Alarms"
                chartData={props.deviceAlarmData}
                chartColors={['#f5222d', '#fa8c16', '#faad14', '#1890ff']}
                chartInnerContent={
                  <>
                    <Title level={2}>{props.deviceAlarmTotal}</Title>
                    <div className="chart-label">Total alarms</div>
                  </>
                }
                items={props.deviceAlarmData}
                onViewMore={() => {}}
                transparent={true}
                rightIcon={<RightOutlined  style={{ cursor: 'pointer' }} onClick={handleAlarmClick}/>}
                showFilter={true}
                filterOptions={inverterBrandOptions}
                filterValue={inverterBrandAlarm}
                onFilterChange={(value) => {
                  setInverterBrandAlarm(value);
                  props.getDeviceAlarm(value);
                }}
                filterPlaceholder="Select brand"
              />
            </Col>
            <Col xs={24} md={10} className='plant-kpi-panel'>
              <DashboardWidget
                title="Half Annual Energy"
                items={props.halfAnnualEnergyData}
                onViewMore={() => {}}
                transparent={true}
                render={() => (
                  <Row>
                    {
                      props.halfAnnualEnergyData.map((item, index) => (
                        <Col xs={24} md={12} key={item.id}>
                          <div className="kpi-item">
                            <div className="kpi-data">
                              <div className="kpi-value">
                                {item.yield_mwh} MWh
                              </div>
                              <div className="kpi-label">
                              {item.startdate} - {item.enddate}
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))
                    }
                  </Row>
                )}
                rightIcon={<></>}
                showFilter={true}
                filterOptions={inverterBrandOptions}
                filterValue={inverterBrandEnergy}
                onFilterChange={(value) => {
                  setInverterBrandEnergy(value);
                  props.getHalfAnnualEnergy(energyDateFilter, value);
                }}
                filterPlaceholder="Select brand"
                extraFilters={
                  <DatePicker
                    className={'form-control'}
                    selected={energyDateFilter ? moment(energyDateFilter, 'YYYY-MM').toDate() : null}
                    onChange={(date) => {
                       const dateString = moment(date).format('YYYY-MM');
                       setEnergyDateFilter(dateString);
                       props.getHalfAnnualEnergy(dateString, inverterBrandEnergy);
                     }}
                    showMonthYearPicker
                    dateFormat="yyyy-MM"
                    placeholderText="Select month"
                    style={{ width: '100%', color: 'black' }}
                    //className="custom-datepicker"
                  />
                }
              />
            </Col>
            <Col xs={24} md={24}>
            {viewMode === 'table' ? (
              <TableContent 
                selectedColumns={selectedColumns}
                setCurrentPage={setCurrentPage}
                handleColumnSelectAll={handleColumnSelectAll}
                setSelectedColumns={setSelectedColumns}
                columnSelectorVisible={columnSelectorVisible}
                setColumnSelectorVisible={setColumnSelectorVisible}
                visibleColumns={visibleColumns}
                currentPage={currentPage}
                pageSize={pageSize}
                handleTableChange={handleTableChange}
                searchName={searchName}
                setSearchName={setSearchName}
                getStationList={props.getStationList}
                stationListData={props.stationListData}
                stationListMeta={props.stationListMeta}
                plantTableColumns={plantTableColumns}
                inverterBrand={inverterBrand}
                setInverterBrand={setInverterBrand}
                purchaseType={purchaseType}
                setPurchaseType={setPurchaseType}
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
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default HOC(HuaweiStyleDashboard); 