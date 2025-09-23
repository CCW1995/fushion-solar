import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import TableContent from './TableContent';
import HOC from './actions';
import './index.scss';

const PlantReport = (props) => {
  const history = useHistory();
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [brand, setBrand] = useState('');
  const [stationName, setStationName] = useState('');
  const [dimension, setDimension] = useState('station');
  const [statisticalPeriod, setStatisticalPeriod] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  
  useEffect(() => {
    const userProfile = props.data.ProfileReducer.profile;
    const isAdmin = userProfile?.role?.name === 'Admin';
    
    if (isAdmin) {
      props.getPlantReport({
        page: 1,
        limit: 10,
        dimension: 'station',
        inverterbrand: '',
        period: 'daily',
        date: new Date().toISOString().slice(0, 10),
        stationName: ''
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
    props.getPlantReport({
      page: newPage,
      limit: newPageSize,
      dimension,
      inverterbrand: brand,
      period: selectedPeriod,
      date: statisticalPeriod ? dayjs(statisticalPeriod).format('YYYY-MM-DD') : null,
      stationName
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
            getPlantReport={props.getPlantReport}
            exportPlantReport={props.exportPlantReport}
            plantReportData={props.plantReportData}
            plantReportMeta={{ itemCount: props.plantReportTotal }}
            brand={brand}
            setBrand={setBrand}
            stationName={stationName}
            setStationName={setStationName}
            dimension={dimension}
            setDimension={setDimension}
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

export default HOC(PlantReport);
