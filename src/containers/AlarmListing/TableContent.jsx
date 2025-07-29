import {
  ExclamationCircleFilled
} from '@ant-design/icons';
import { Button, Col, DatePicker, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import './index.scss';

function TableContent({
  currentPage,
  pageSize,
  stationListData,
  handleTableChange,
  searchName,
  setSearchName,
  getDeviceAlarm,
  stationListMeta,
  inverterBrand,
  setInverterBrand,
  deviceSn,
  setDeviceSn,
  alarmId,
  setAlarmId,
  alarmName,
  setAlarmName,
  alarmStartTime,
  setAlarmStartTime,
  alarmEndTime,
  setAlarmEndTime
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

  // Table columns for alarm listing
  const alarmTableColumns = [
    {
      title: 'Alarm Level',
      dataIndex: 'alarm_level',
      key: 'alarm_level',
      render: (text) => {
        let color = '#faad14';
        let label = text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
        if (text === 'critical') color = '#f5222d';
        if (text === 'major') color = '#faad14';
        if (text === 'minor') color = '#1890ff';
        if (text === 'warning') color = '#bfbfbf';
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
      title: 'Device Name',
      dataIndex: 'device_name',
      key: 'device_name',
      render: (text) => <span>{text}</span>,
      ellipsis: true,
      width: 180,
    },
    {
      title: 'SN',
      dataIndex: 'esn_code',
      key: 'esn_code',
      ellipsis: true,
      width: 140,
    },
    {
      title: 'Alarm ID',
      dataIndex: 'alarm_id',
      key: 'alarm_id',
      width: 120,
    },
    {
      title: 'Alarm Name',
      dataIndex: 'alarm_name',
      key: 'alarm_name',
      render: (text) => <span>{text}</span>,
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Begin Time',
      dataIndex: 'alarm_begin_time',
      key: 'alarm_begin_time',
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
                <Row gutter={[16, 16]} align="bottom">
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label style={{ display: 'block' }}>Plant name</label>
                    <Input 
                      placeholder="Plant Name" 
                      style={{ width: '100%' }}
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label style={{ display: 'block' }}>Inverter Brand</label>
                    <Select
                      placeholder="Select brand"
                      style={{ width: '100%' }}
                      value={inverterBrand}
                      onChange={setInverterBrand}
                      options={inverterBrandOptions}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label style={{ display: 'block' }}>Device SN</label>
                    <Input 
                      placeholder="Device SN" 
                      style={{ width: '100%' }}
                      value={deviceSn}
                      onChange={(e) => setDeviceSn(e.target.value)}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label style={{ display: 'block' }}>Alarm ID</label>
                    <Input 
                      placeholder="Alarm ID" 
                      style={{ width: '100%' }}
                      value={alarmId}
                      onChange={(e) => setAlarmId(e.target.value)}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label style={{ display: 'block' }}>Alarm Name</label>
                    <Input 
                      placeholder="Alarm Name" 
                      style={{ width: '100%' }}
                      value={alarmName}
                      onChange={(e) => setAlarmName(e.target.value)}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label style={{ display: 'block' }}>Alarm Start Time</label>
                    <DatePicker
                      placeholder="Start Time"
                      style={{ width: '100%' }}
                      value={alarmStartTime}
                      onChange={setAlarmStartTime}
                      showTime
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="filter-item">
                    <label style={{ display: 'block' }}>Alarm End Time</label>
                    <DatePicker
                      placeholder="End Time"
                      style={{ width: '100%' }}
                      value={alarmEndTime}
                      onChange={setAlarmEndTime}
                      showTime
                    />
                  </Col>
                  <Col span={24} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                    <Button type="primary" onClick={() => getDeviceAlarm({
                      stationName: searchName,
                      page: 1,
                      limit: 10,
                      inverterBrand,
                      deviceSn,
                      alarmId,
                      alarmName,
                      alarmStartTime,
                      alarmEndTime
                    })}>Search</Button>
                    <Button onClick={() => {
                      setSearchName('');
                      setInverterBrand('');
                      setDeviceSn('');
                      setAlarmId('');
                      setAlarmName('');
                      setAlarmStartTime(null);
                      setAlarmEndTime(null);
                    }}>Reset</Button>
                  </Col>
                </Row>
              </div>
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