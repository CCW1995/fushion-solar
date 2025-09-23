import { Button, Col, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  exportPlantReport,
  plantReportMeta,
  brand,
  setBrand,
  stationName,
  setStationName,
  dimension,
  setDimension,
  statisticalPeriod,
  setStatisticalPeriod,
  selectedPeriod,
  setSelectedPeriod
}) {

  // Brand options
  const brandOptions = [
    { value: '', label: 'All' },
    { value: 'fusionsolar', label: 'FusionSolar' },
    { value: 'soliscloud', label: 'SolisCloud' },
    { value: 'sungrow', label: 'Sungrow' },
    { value: 'growatt', label: 'Growatt' }
  ];

  // Dimension options
  const dimensionOptions = [
    { value: 'station', label: 'Station' },
    { value: 'time', label: 'Time' }
  ];

  // Period options for date picker
  const periodOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'lifetime', label: 'Lifetime' }
  ];

  // Table columns for plant report
  const plantReportColumns = [
    {
      title: 'Station Name',
      dataIndex: 'station_name',
      key: 'station_name',
      render: (text) => <span>{text}</span>,
      ellipsis: true,
      width: 200
    },
    {
      title: 'Station Address',
      dataIndex: 'station_address',
      key: 'station_address',
      render: (text) => <span>{text}</span>,
      ellipsis: true,
      width: 250
    },
    {
      title: 'Inverter Yield (kWh)',
      dataIndex: 'inverter_yield',
      key: 'inverter_yield',
      render: (text) => <span>{text ? parseFloat(text).toFixed(3) : '-'}</span>,
      width: 180
    },
    {
      title: 'Self Consumption (kWh)',
      dataIndex: 'self_consumption',
      key: 'self_consumption',
      render: (text) => <span>{text ? parseFloat(text).toFixed(3) : '-'}</span>,
      width: 200
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (text) => <span>{text ? parseFloat(text).toFixed(2) : '-'}</span>,
      width: 120
    },
    {
      title: 'Import (kWh)',
      dataIndex: 'import',
      key: 'import',
      render: (text) => <span>{text ? parseFloat(text).toFixed(3) : '-'}</span>,
      width: 150
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
                    <label>User ID</label>
                    <Input
                      placeholder="Enter station name"
                      style={{ width: '100%' }}
                      value={stationName}
                      onChange={(e) => setStationName(e.target.value)}
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
                    <label>Period</label>
                    <Select
                      placeholder="Select period"
                      style={{ width: '100%' }}
                      value={selectedPeriod}
                      onChange={(value) => {
                        setSelectedPeriod(value);
                        if (value === 'daily') {
                          setStatisticalPeriod(new Date());
                        } else {
                          setStatisticalPeriod(null);
                        }
                      }}
                      options={periodOptions}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label>Date</label>
                    {selectedPeriod === 'yearly' && (
                      <DatePicker
                        selected={statisticalPeriod}
                        onChange={date => setStatisticalPeriod(date)}
                        showYearPicker
                        dateFormat="yyyy"
                        className="form-control"
                        maxDate={new Date()}
                        placeholderText="Select year"
                        style={{ width: '100%' }}
                      />
                    )}
                    {selectedPeriod === 'monthly' && (
                      <DatePicker
                        selected={statisticalPeriod}
                        onChange={date => setStatisticalPeriod(date)}
                        showMonthYearPicker
                        dateFormat="MM/yyyy"
                        className="form-control"
                        maxDate={new Date()}
                        placeholderText="Select month"
                        style={{ width: '100%' }}
                      />
                    )}
                    {selectedPeriod === 'daily' && (
                      <DatePicker
                        selected={statisticalPeriod}
                        onChange={date => setStatisticalPeriod(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        maxDate={new Date()}
                        placeholderText="Select date"
                        style={{ width: '100%' }}
                      />
                    )}
                    {selectedPeriod === 'lifetime' && (
                      <Input
                        placeholder="All time data"
                        style={{ width: '100%' }}
                        disabled
                        value="All time"
                      />
                    )}
                  </Col>
                  <Col span={24} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                    <Button type="primary" onClick={() => getPlantReport({
                      page: 1,
                      limit: 10,
                      dimension,
                      inverterbrand: brand,
                      period: selectedPeriod,
                      date: statisticalPeriod ? dayjs(statisticalPeriod).format('YYYY-MM-DD') : null,
                      stationName
                    })}>Search</Button>
                    <Button onClick={() => {
                      setBrand('');
                      setStationName('');
                      setDimension('station');
                      setStatisticalPeriod(new Date());
                      setSelectedPeriod('daily');
                      getPlantReport({
                        page: 1,
                        limit: 10,
                        dimension: 'station',
                        inverterbrand: '',
                        period: 'daily',
                        date: new Date().toISOString().slice(0, 10),
                        stationName: ''
                      })
                      setCurrentPage(1)
                    }}>Reset</Button>
                    <Button type="default" onClick={() => exportPlantReport({
                      dimension,
                      period: selectedPeriod,
                      date: statisticalPeriod ? dayjs(statisticalPeriod).format('YYYY-MM-DD') : null,
                      inverterbrand: brand,
                      stationName
                    })}>Export</Button>
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
