import {
  CloseOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import { Button, Checkbox, Col, DatePicker, Input, Row, Select, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import './index.scss';

const { Title, Text } = Typography;
const { Option } = Select;

function TableContent({
  selectedColumns,
  setSelectedColumns,
  handleColumnSelectAll,
  columnSelectorVisible,
  setColumnSelectorVisible,
  visibleColumns,
  currentPage,
  pageSize,
  stationListData,
  handleColumnSelect,
  handleTableChange,
  searchName,
  setSearchName,
  getStationList,
  stationListMeta,
  plantTableColumns
}) {

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

  // Table columns for alarm listing
  const alarmTableColumns = [
    {
      title: 'Alarm Severity',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = '#faad14';
        let label = text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
        if (text === 'critical') color = '#f5222d';
        if (text === 'major') color = '#faad14';
        if (text === 'minor') color = '#1890ff';
        if (text === 'warning') color = '#bfbfbf';
        return label
        return <span><ExclamationCircleFilled style={{ color }} /> {label}</span>;
      },
      width: 120,
    },
    {
      title: 'Plant Name',
      dataIndex: 'station_name',
      key: 'station_name',
      render: (text) => <span>{text}</span>,
      ellipsis: true,
      width: 180,
    },
    {
      title: 'Plant ID',
      dataIndex: 'station_code',
      key: 'station_code',
      ellipsis: true,
      width: 180,
    },
    {
      title: 'Plant Address',
      dataIndex: 'station_address',
      key: 'station_address',
      ellipsis: true,
      width: 140,
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 120,
      render: (text) => `${text} kWh`,
    },
    {
      title: 'Occurrence Time',
      dataIndex: 'grid_connection_date',
      key: 'grid_connection_date',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '',
      width: 180,
    }
  ];

  return (
    <>
      <Row gutter={[16, 16]}>
            <Col xs={24} className="white-background-panel">
              <div className="plant-list-panel">
                <div className="plant-list-header">
                  <div className="search-filters">
                    <Row gutter={[32, 16]} align="bottom">
                      <Col span={24} className="filter-item">
                        <label style={{ display: 'block' }}>Plant name</label>
                        <Input 
                          placeholder="Plant Name" 
                          style={{ width: '100%' }}
                          value={searchName}
                          onChange={(e) => setSearchName(e.target.value)}
                        />
                      </Col>
                      {/* <Col xs={24} sm={12} md={12} lg={12} xl={12} className="filter-item">
                        <label style={{ display: 'block' }}>SN</label>
                        <Input placeholder="SN" style={{ width: '100%' }} />
                      </Col>
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="filter-item">
                        <label style={{ display: 'block' }}>Alarm ID</label>
                        <Input placeholder="Alarm ID" style={{ width: '100%' }} />
                      </Col>
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="filter-item">
                        <label style={{ display: 'block' }}>Alarm name</label>
                        <Input placeholder="Alarm Name" style={{ width: '100%' }} />
                      </Col>
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="filter-item">
                        <label style={{ display: 'block' }}>Occurrence time</label>
                        <DatePicker.RangePicker style={{ width: '100%' }} />
                      </Col> */}
                      <Col span={24} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                        <Button type="primary" onClick={() => getStationList(searchName, 1)}>Search</Button>
                        <Button onClick={() => setSearchName('')}>Reset</Button>
                      </Col>
                    </Row>
                  </div>
                  {/* <div className="action-buttons">
                    <div className="expand-button">
                      <Button type="default">Expand</Button>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />}>Add Plant</Button>
                  </div> */}
                </div>
                
                <div className="search-actions">
                  {/* <Button type="primary" onClick={() => getStationList(searchName, 1)}>Search</Button>
                  <Button onClick={() => setSearchName('')}>Reset</Button> */}
                  {/* <div className="settings-button">
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
                  </div> */}
                </div>
                
                <Table 
                  columns={alarmTableColumns} 
                  dataSource={stationListData}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: stationListMeta?.itemCount || 0,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: (total) => `Total records: ${stationListMeta?.itemCount || 0}`
                  }}
                  onChange={handleTableChange}
                  scroll={{ x: 'max-content' }}
                  className="plant-list-table"
                />
              </div>
            </Col>
          </Row>
    </>
  )
}

export default TableContent