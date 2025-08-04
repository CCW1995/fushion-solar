import {
  CloseOutlined,
  SettingFilled
} from '@ant-design/icons';
import { Button, Checkbox, Col, Input, Popover, Row, Select, Space, Table, Typography } from 'antd';
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
  setCurrentPage,
  pageSize,
  stationListData,
  handleColumnSelect,
  handleTableChange,
  searchName,
  setSearchName,
  getStationList,
  stationListMeta,
  plantTableColumns,
  inverterBrand,
  setInverterBrand
}) {

  // Inverter brand options
  const inverterBrandOptions = [
    { value: '', label: '--' },
    { value: 'fusionsolar', label: 'fusionsolar' },
    { value: 'soliscloud', label: 'soliscloud' },
    { value: 'sungrow', label: 'sungrow' },
    { value: 'goodwe', label: 'goodwe' },
    { value: 'growatt', label: 'growatt' }
  ];

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
  return (
    <>
      <Row gutter={[16, 16]}>
            <Col xs={24} className="white-background-panel">
              <div className="plant-list-panel">
                <div className="plant-list-header">
                  <div className="search-filters">
                    <div className="filter-item">
                      <label>Plant name</label>
                      <Input 
                        placeholder="Plant name" 
                        style={{ width: '100%' }}
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                      />
                    </div>
                    <div className="filter-item">
                      <label>Inverter Brand</label>
                      <Select
                        style={{ width: '100%' }}
                        value={inverterBrand}
                        onChange={setInverterBrand}
                        placeholder="Select Inverter Brand"
                      >
                        {inverterBrandOptions.map(option => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    {/* <div className="filter-item">
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
                    </div> */}
                  </div>
                  {/* <div className="action-buttons">
                    <div className="expand-button">
                      <Button type="default">Expand</Button>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />}>Add Plant</Button>
                  </div> */}
                </div>
                
                <div className="search-actions">
                  <Button type="primary" onClick={() => getStationList(searchName, 1, 10, inverterBrand)}>Search</Button>
                  <Button onClick={() => {
                    setSearchName('');
                    setInverterBrand('');
                    setCurrentPage(1)
                    getStationList('', 1, 10, '')
                  }}>Reset</Button>
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
                  columns={plantTableColumns} 
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