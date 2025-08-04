import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TableContent from './TableContent';
import HOC from './actions';
import './index.scss';

const AlarmListing = (props) => {
  const history = useHistory();
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [inverterBrand, setInverterBrand] = useState('');
  const [deviceSn, setDeviceSn] = useState('');
  const [alarmId, setAlarmId] = useState('');
  const [alarmName, setAlarmName] = useState('');
  const [alarmStartTime, setAlarmStartTime] = useState(null);
  const [alarmEndTime, setAlarmEndTime] = useState(null);
  
  useEffect(() => {
    const userProfile = props.data.ProfileReducer.profile;
    const isAdmin = userProfile?.role?.name === 'Admin';
    
    if (isAdmin) {
      props.getDeviceAlarm({
        page: 1,
        limit: 10
      });
    } else {
      history.push('/dashboard/plant-monitoring');
    }
  }, []);
  
  const handleTableChange = (pagination, filters, sorter) => {
    const newPage = pagination.current;
    const newPageSize = pagination.pageSize;
    
    // Update state
    setCurrentPage(newPage);
    setPageSize(newPageSize);
    
    // Call API with new page, page size, and current search name
    props.getDeviceAlarm({
      stationName: searchName,
      page: newPage,
      limit: newPageSize,
      inverterBrand,
      deviceSn,
      alarmId,
      alarmName,
      alarmStartTime,
      alarmEndTime
    });
  };

  return (
    <>
      <div className="home">
        <div className="dashboard-widgets">
          <TableContent 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            handleTableChange={handleTableChange}
            searchName={searchName}
            setSearchName={setSearchName}
            getDeviceAlarm={props.getDeviceAlarm}
            stationListData={props.deviceAlarmData}
            stationListMeta={{ itemCount: props.deviceAlarmTotal }}
            inverterBrand={inverterBrand}
            setInverterBrand={setInverterBrand}
            deviceSn={deviceSn}
            setDeviceSn={setDeviceSn}
            alarmId={alarmId}
            setAlarmId={setAlarmId}
            alarmName={alarmName}
            setAlarmName={setAlarmName}
            alarmStartTime={alarmStartTime}
            setAlarmStartTime={setAlarmStartTime}
            alarmEndTime={alarmEndTime}
            setAlarmEndTime={setAlarmEndTime}
          />
        </div>
      </div>
    </>
  );
};

export default HOC(AlarmListing); 