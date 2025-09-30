import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import TableContent from './TableContent';
import HOC from './actions';
import './index.scss';

const InverterReport = (props) => {
  const history = useHistory();
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [brand, setBrand] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [statisticalPeriod, setStatisticalPeriod] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  
  useEffect(() => {
    const userProfile = props.data.ProfileReducer.profile;
    const isAdmin = userProfile?.role?.name === 'Admin';
    
    if (isAdmin) {
      props.getInverterReport({
        page: 1,
        limit: 10,
        inverterBrand: '',
        deviceName: '',
        period: 'daily',
        date: new Date().toISOString().slice(0, 10)
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
    
    // Call API with new page, page size, and current filters
    props.getInverterReport({
      page: newPage,
      limit: newPageSize,
      inverterBrand: brand,
      deviceName,
      period: selectedPeriod.toLowerCase(),
      date: statisticalPeriod ? dayjs(statisticalPeriod).format('YYYY-MM-DD') : null
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
            getInverterReport={props.getInverterReport}
            exportInverterReport={props.exportInverterReport}
            inverterReportData={props.inverterReportData}
            inverterReportMeta={{ itemCount: props.inverterReportTotal }}
            brand={brand}
            setBrand={setBrand}
            deviceName={deviceName}
            setDeviceName={setDeviceName}
            statisticalPeriod={statisticalPeriod}
            setStatisticalPeriod={setStatisticalPeriod}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
          />
        </div>
      </div>
    </>
  );
};

export default HOC(InverterReport);
