import {
  BarChartOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import { Button, Divider, Layout, Menu, Typography } from 'antd';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { setSelectedSite } from '../../reducers/siteSelector';

// Import logos
import logoSmall from '../../assets/logo-small.svg';
import logoFull from '../../assets/logo.svg';

import './FusionSolarLayout.scss';

const { Sider } = Layout;
const { Text } = Typography;

const FusionSolarSider = ({ collapsed, setCollapsed, isMobile, onClose, data, stationList }) => {
  console.log(data);
  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();
  const selectedSite = data.SiteReducer.selectedSite

  // Pagination state for stations
  const [stationPage, setStationPage] = useState(0);
  const stationsPerPage = 15;
  const totalStations = stationList.length;
  const totalPages = Math.ceil(totalStations / stationsPerPage);
  const paginatedStations = stationList.slice(
    stationPage * stationsPerPage,
    (stationPage + 1) * stationsPerPage
  );

  // Determine the currently active menu item based on the current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/huawei-dashboard')) return '1';
    if (path.includes('/dashboard/plant-monitoring')) return '2';
    return '1'; // Default to dashboard
  };

  // Handle menu item clicks
  const handleMenuClick = ({ key }) => {
    switch (key) {
        case '1':
          history.push('/dashboard/huawei-dashboard');
          break;
      case '2':
        history.push('/dashboard/plant-monitoring');
        break;
      default:
        history.push('/dashboard/plant-monitoring');
    }
    if (isMobile && onClose) onClose(); // Close drawer on mobile after click
  };

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      className={`fusion-sider${isMobile ? ' fusion-sider-mobile' : ''}`}
      width={220}
      style={isMobile
        ? { height: '100vh', maxHeight: '100vh', background: '#001529', boxShadow: '2px 0 8px rgba(0,0,0,0.15)' }
        : { height: '100vh', maxHeight: '100vh' }}
    >
      <div className={`logo${isMobile ? ' logo-mobile' : ''}`} style={isMobile ? { padding: '24px 16px 12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' } : {}}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img 
            src={logoSmall} 
            alt="Logo" 
            style={{ height: 24, width: 24 }}
            className="logo-small"
          />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>Bayenergy</Text>
        {/* {!collapsed ? (
          <img 
            src={logoSmall} 
            alt="Bayenergy Logo" 
            className="logo-full d-none d-md-block"
          />
        ) : (
          <img 
            src={logoSmall} 
            alt="Logo" 
            className="logo-small"
          />
        )} */}
        </div>
        {isMobile && (
          <Button
            type="text"
            icon={<CloseOutlined style={{ fontSize: 22, color: '#fff' }} />}
            onClick={onClose}
            style={{ position: 'absolute', right: 0, top: 0 }}
          />
        )}
      </div>
      {/* Station List with Pagination */}
      <div style={{ padding: isMobile ? '0 16px 12px 16px' : '5px' }}>
        <div style={{ height: 500, overflowY: 'auto', marginBottom: 8 }}>
          {paginatedStations.map((item) => (
            <div
              key={item.station_name}
              onClick={() => dispatch(setSelectedSite(item.station_name))}
              style={{
                padding: '8px 12px',
                marginBottom: 4,
                borderRadius: 6,
                background: selectedSite === item.station_name ? '#1890ff' : 'transparent',
                color: selectedSite === item.station_name ? '#fff' : '#d9d9d9',
                cursor: 'pointer',
                fontWeight: selectedSite === item.station_name ? 600 : 400,
                transition: 'background 0.2s',
                border: selectedSite === item.station_name ? '1px solid #1890ff' : '1px solid transparent',
                boxShadow: selectedSite === item.station_name ? '0 2px 8px rgba(24,144,255,0.12)' : 'none',
                userSelect: 'none',
              }}
            >
              {item.station_name}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            size="small"
            type="text"
            disabled={stationPage === 0}
            onClick={() => setStationPage(stationPage - 1)}
            style={{ minWidth: 32, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            aria-label="Previous"
          >
            <LeftOutlined style={{ color: '#ffff' }}/>
          </Button>
          <span style={{ color: '#d9d9d9', fontSize: 13 }}>
            Page {stationPage + 1} / {totalPages || 1}
          </span>
          <Button
            size="small"
            type="text"
            disabled={stationPage >= totalPages - 1}
            onClick={() => setStationPage(stationPage + 1)}
            style={{ minWidth: 32, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            aria-label="Next"
          >
            <RightOutlined style={{ color: '#ffff' }}/>
          </Button>
        </div>
      </div>
      {isMobile && <Divider style={{ margin: '0 0 12px 0', borderColor: '#22304a' }} />}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        className={`fusion-menu${isMobile ? ' fusion-menu-mobile' : ''}`}
        onClick={handleMenuClick}
        style={isMobile ? { fontSize: 15, padding: '0 2px' } : {}}
        items={[
          // {
          //   key: '1',
          //   icon: <HomeOutlined style={isMobile ? { fontSize: 18 } : {}} />,
          //   label: <span style={isMobile ? { fontWeight: 600, fontSize: 15 } : {}}>Dashboard</span>,
          //   title: 'Dashboard',
          // },
        ]}
      />
    </Sider>
  );
};


const mapStateToProps = (state) => ({
  data: state,
});

export default connect(mapStateToProps)(FusionSolarSider); 