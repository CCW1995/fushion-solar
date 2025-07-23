import {
  CloseOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Button, Checkbox, Col, Row, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TableContent from './TableContent';
import HOC from './actions';
import {
  allParameters,
  getPlantTableColumns
} from './assets.jsx';
import './index.scss';

const { Title, Text } = Typography;

const HuaweiStyleDashboard = (props) => {
  const history = useHistory();
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
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Get the plant table columns with navigation function
  const plantTableColumns = getPlantTableColumns(history.push);
  
  useEffect(() => {
    const userProfile = props.data.ProfileReducer.profile;
    const isAdmin = userProfile?.role?.name === 'Admin';
    
    if (isAdmin) {
      props.getKpi();
      props.getDeviceAlarm();
      props.getDeviceStatus();
      props.getStationList('', 1);  
    } else {
      history.push('/dashboard/plant-monitoring');
    }
  }, []);
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

  
  const handleTableChange = (pagination, filters, sorter) => {
    const newPage = pagination.current;
    const newPageSize = pagination.pageSize;
    
    // Update state
    setCurrentPage(newPage);
    setPageSize(newPageSize);
    
    // Call API with new page, page size, and current search name
    props.getStationList(searchName, newPage, newPageSize);
  };

  useEffect(() => {
    searchName && props.getStationList(searchName, 1, pageSize);
  }, [searchName]);

  // Columns selection handler
  const handleColumnSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedColumns(plantTableColumns.map(col => col.key || col.dataIndex));
    } else {
      setSelectedColumns([]);
    }
  };

  // Modified plantTableColumns to only include selected columns
  const visibleColumns = plantTableColumns.filter(column => 
    selectedColumns.includes(column.key || column.dataIndex)
  );

  return (
    <>
      <div className="home">
        <div className="dashboard-controls">
        </div>
        
        <div className={`dashboard-widgets ${dashboardCollapsed ? 'collapsed' : ''}`}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24}>
              <TableContent 
                selectedColumns={selectedColumns}
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
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default HOC(HuaweiStyleDashboard); 