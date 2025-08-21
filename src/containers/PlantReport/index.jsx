import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TableContent from './TableContent';
import HOC from './actions';
import './index.scss';

const PlantReport = (props) => {
  const history = useHistory();
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [brand, setBrand] = useState('');
  const [plant, setPlant] = useState('');
  const [dimension, setDimension] = useState('By plant');
  const [timeGranularity, setTimeGranularity] = useState('Daily');
  const [statisticalPeriod, setStatisticalPeriod] = useState(null);
  
  useEffect(() => {
    const userProfile = props.data.ProfileReducer.profile;
    const isAdmin = userProfile?.role?.name === 'Admin';
    
    if (isAdmin) {
      props.getPlantReport({
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
    
    // Call API with new page, page size, and current filters
    props.getPlantReport({
      brand,
      plant,
      dimension,
      timeGranularity,
      statisticalPeriod,
      page: newPage,
      limit: newPageSize
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
            plantReportData={props.plantReportData}
            plantReportMeta={{ itemCount: props.plantReportTotal }}
            brand={brand}
            setBrand={setBrand}
            plant={plant}
            setPlant={setPlant}
            dimension={dimension}
            setDimension={setDimension}
            timeGranularity={timeGranularity}
            setTimeGranularity={setTimeGranularity}
            statisticalPeriod={statisticalPeriod}
            setStatisticalPeriod={setStatisticalPeriod}
          />
        </div>
      </div>
    </>
  );
};

export default HOC(PlantReport);
