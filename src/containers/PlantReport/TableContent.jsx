import { Button, Col, DatePicker, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import './index.scss';

function TableContent({
  currentPage,
  pageSize,
  plantReportData,
  handleTableChange,
  searchName,
  setSearchName,
  getPlantReport,
  plantReportMeta,
  brand,
  setBrand,
  plant,
  setPlant,
  dimension,
  setDimension,
  timeGranularity,
  setTimeGranularity,
  statisticalPeriod,
  setStatisticalPeriod
}) {

  // Brand options
  const brandOptions = [
    { value: '', label: 'All' },
    { value: 'fusionsolar', label: 'FusionSolar' },
    { value: 'soliscloud', label: 'SolisCloud' },
    { value: 'sungrow', label: 'Sungrow' },
    { value: 'goodwe', label: 'GoodWe' },
    { value: 'growatt', label: 'Growatt' }
  ];

  // Plant options
  const plantOptions = [
    { value: '', label: 'All' },
    { value: 'plant1', label: 'Plant 1' },
    { value: 'plant2', label: 'Plant 2' }
  ];

  // Dimension options
  const dimensionOptions = [
    { value: 'By plant', label: 'By plant' },
    { value: 'By time', label: 'By time' }
  ];

  // Time granularity options
  const timeGranularityOptions = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' }
  ];

  // Table columns for plant report
  const plantReportColumns = [
    {
      title: 'Plant Name',
      dataIndex: 'plant_name',
      key: 'plant_name',
      render: (text) => <span>{text}</span>,
      ellipsis: true,
      width: 200
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text) => <span>{text}</span>,
      ellipsis: true,
      width: 250
    },
    {
      title: 'PV Yield (kWh)',
      dataIndex: 'pv_yield',
      key: 'pv_yield',
      render: (text) => <span>{text ? parseFloat(text).toFixed(3) : '-'}</span>,
      width: 150
    },
    {
      title: 'Plant Yield (kWh)',
      dataIndex: 'plant_yield',
      key: 'plant_yield',
      render: (text) => <span>{text ? parseFloat(text).toFixed(3) : '-'}</span>,
      width: 180
    },
    {
      title: 'Export (kWh)',
      dataIndex: 'export',
      key: 'export',
      render: (text) => <span>{text ? parseFloat(text).toFixed(3) : '-'}</span>,
      width: 150
    },
    {
      title: 'Specific Energy (kWh/kWp)',
      dataIndex: 'specific_energy',
      key: 'specific_energy',
      render: (text) => <span>{text ? parseFloat(text).toFixed(3) : '-'}</span>,
      width: 200
    },
    {
      title: 'Consumption (kWh)',
      dataIndex: 'consumption',
      key: 'consumption',
      render: (text) => <span>{text ? parseFloat(text).toFixed(3) : '-'}</span>,
      width: 150
    }
  ];

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} className="white-background-panel">
          <div className="plant-report-panel">
            <div className="plant-report-header">
              <div className="search-filters">
                <Row gutter={[16, 16]} align="bottom">
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label>Brand</label>
                    <Select
                      placeholder="All"
                      style={{ width: '100%' }}
                      value={brand}
                      onChange={setBrand}
                      options={brandOptions}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label>Plant</label>
                    <Select
                      placeholder="All"
                      style={{ width: '100%' }}
                      value={plant}
                      onChange={setPlant}
                      options={plantOptions}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label>Dimension</label>
                    <Select
                      placeholder="Select dimension"
                      style={{ width: '100%' }}
                      value={dimension}
                      onChange={setDimension}
                      options={dimensionOptions}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label>Time granularity</label>
                    <Select
                      placeholder="Select granularity"
                      style={{ width: '100%' }}
                      value={timeGranularity}
                      onChange={setTimeGranularity}
                      options={timeGranularityOptions}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label>Statistical period</label>
                    <DatePicker
                      placeholder="Select date"
                      style={{ width: '100%' }}
                      value={statisticalPeriod}
                      onChange={setStatisticalPeriod}
                      format="YYYY-MM-DD"
                    />
                  </Col>
                  <Col span={24} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                    <Button type="primary" onClick={() => getPlantReport({
                      brand,
                      plant,
                      dimension,
                      timeGranularity,
                      statisticalPeriod,
                      page: 1,
                      limit: 10
                    })}>Search</Button>
                    <Button onClick={() => {
                      setBrand('');
                      setPlant('');
                      setDimension('By plant');
                      setTimeGranularity('Daily');
                      setStatisticalPeriod(null);
                      getPlantReport({
                        brand: '',
                        plant: '',
                        dimension: 'By plant',
                        timeGranularity: 'Daily',
                        statisticalPeriod: null,
                        page: 1,
                        limit: 10
                      })
                      setCurrentPage(1)
                    }}>Reset</Button>
                  </Col>
                </Row>
              </div>
            </div>
            
            <Table 
              columns={plantReportColumns} 
              dataSource={plantReportData}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: plantReportMeta?.itemCount || 0,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total) => `Total: ${plantReportMeta?.itemCount || 0}`
              }}
              onChange={handleTableChange}
              scroll={{ x: 'max-content' }}
              className="plant-report-table"
            />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default TableContent
