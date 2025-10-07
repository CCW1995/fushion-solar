import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import TableContent from './TableContent';
import HOC from './actions';
import './index.scss';

const PSHReport = (props) => {
  const history = useHistory();
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [brand, setBrand] = useState('');
  const [stationName, setStationName] = useState('');
  const [classification, setClassification] = useState('');
  const [statisticalPeriod, setStatisticalPeriod] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  
  useEffect(() => {
    const userProfile = props.data.ProfileReducer.profile;
    const isAdmin = userProfile?.role?.name === 'Admin';
    
    if (isAdmin) {
      props.getPSHReport({
        page: 1,
        limit: 10,
        inverterBrand: '',
        stationName: '',
        classification: '',
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
    props.getPSHReport({
      page: newPage,
      limit: newPageSize,
      inverterBrand: brand,
      stationName,
      classification,
      period: selectedPeriod.toLowerCase(),
      date: statisticalPeriod ? dayjs(statisticalPeriod).format('YYYY-MM-DD') : null
    });
  };

  return (
    <>
      <div className="home">
        <div className="dashboard-widgets">
          <TableContent 
            loading={props.loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            handleTableChange={handleTableChange}
            searchName={searchName}
            setSearchName={setSearchName}
            getPSHReport={props.getPSHReport}
            exportPSHReport={props.exportPSHReport}
            pshReportData={props.pshReportData}
            pshReportMeta={{ itemCount: props.pshReportTotal }}
            brand={brand}
            setBrand={setBrand}
            stationName={stationName}
            setStationName={setStationName}
            classification={classification}
            setClassification={setClassification}
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

export default HOC(PSHReport);
