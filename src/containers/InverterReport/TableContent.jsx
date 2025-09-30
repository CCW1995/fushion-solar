import { Button, Col, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import './index.scss';

// Helper function to format date based on period
const formatDateByPeriod = (date, period) => {
  if (!date) return null;
  
  switch (period) {
    case 'daily':
      return dayjs(date).format('YYYY-MM-DD');
    case 'monthly':
      return dayjs(date).format('YYYY-MM');
    case 'yearly':
      return dayjs(date).format('YYYY');
    case 'lifetime':
      return dayjs(date).format('YYYY'); // Year format for lifetime
    default:
      return dayjs(date).format('YYYY-MM-DD');
  }
};

function TableContent({
  currentPage,
  pageSize,
  inverterReportData,
  handleTableChange,
  searchName,
  setSearchName,
  getInverterReport,
  exportInverterReport,
  inverterReportMeta,
  brand,
  setBrand,
  deviceName,
  setDeviceName,
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
    { value: 'sungrow', label: 'Sungrow' }
  ];

  // Period options for date picker
  const periodOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'lifetime', label: 'Lifetime' }
  ];

  // Table columns for inverter report
  const inverterReportColumns = [
    {
      title: 'Scheme Name',
      dataIndex: 'schema_name',
      key: 'schema_name',
      render: (text) => <span>{text}</span>,
      ellipsis: true,
      width: 200
    },
    {
      title: 'Station Name',
      dataIndex: 'station_name',
      key: 'station_name',
      render: (text) => <span>{text}</span>,
      ellipsis: true,
      width: 200
    },
    {
      title: 'Device SN',
      dataIndex: 'device_sn',
      key: 'device_sn',
      render: (text) => <span>{text}</span>,
      ellipsis: true,
      width: 150
    },
    {
      title: 'Capacity (kW)',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (text) => <span>{text ? parseFloat(text).toFixed(3) : '-'}</span>,
      width: 200
    },
    {
      title: 'Yield (kWh)',
      dataIndex: 'yield',
      key: 'yield',
      render: (text) => <span>{text ? parseFloat(text).toFixed(3) : '-'}</span>,
      width: 200
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
          <div className="inverter-report-panel">
            <div className="inverter-report-header">
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
                    <label>Station Name</label>
                    <Input
                      placeholder="Enter device name"
                      style={{ width: '100%' }}
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
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
                      <DatePicker
                        selected={statisticalPeriod}
                        onChange={date => setStatisticalPeriod(date)}
                        dateFormat="yyyy"
                        showYearPicker
                        yearItemNumber={12}
                        className="form-control"
                        maxDate={new Date()}
                        placeholderText="Select year"
                        style={{ width: '100%' }}
                      />
                    )}
                  </Col>
                  <Col span={24} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                    <Button type="primary" onClick={() => getInverterReport({
                      page: 1,
                      limit: 10,
                      inverterBrand: brand,
                      deviceName,
                      period: selectedPeriod.toLowerCase(),
                      date: formatDateByPeriod(statisticalPeriod, selectedPeriod.toLowerCase())
                    })}>Search</Button>
                    <Button onClick={() => {
                      setBrand('');
                      setDeviceName('');
                      setStatisticalPeriod(new Date());
                      setSelectedPeriod('daily');
                      getInverterReport({
                        page: 1,
                        limit: 10,
                        inverterBrand: '',
                        deviceName: '',
                        period: 'daily',
                        date: new Date().toISOString().slice(0, 10)
                      })
                      setCurrentPage(1)
                    }}>Reset</Button>
                    <Button type="default" onClick={() => exportInverterReport({
                      inverterBrand: brand,
                      deviceName,
                      period: selectedPeriod.toLowerCase(),
                      date: formatDateByPeriod(statisticalPeriod, selectedPeriod.toLowerCase())
                    })}>Export</Button>
                  </Col>
                </Row>
              </div>
            </div>
            
            <Table 
              columns={inverterReportColumns} 
              dataSource={inverterReportData}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: inverterReportMeta?.itemCount || 0,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total) => `Total: ${inverterReportMeta?.itemCount || 0}`
              }}
              onChange={handleTableChange}
              scroll={{ x: 'max-content' }}
              className="inverter-report-table"
            />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default TableContent
