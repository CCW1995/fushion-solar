import React from 'react';
import { Layout, Menu, Button, Divider } from 'antd';
import {
  HomeOutlined,
  BarChartOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Link, useHistory, useLocation } from 'react-router-dom';

// Import logos
import logoFull from '../../assets/logo.svg';
import logoSmall from '../../assets/logo-small.svg';

import './FusionSolarLayout.scss';

const { Sider } = Layout;

const FusionSolarSider = ({ collapsed, setCollapsed, isMobile, onClose }) => {
  const history = useHistory();
  const location = useLocation();

  // Determine the currently active menu item based on the current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/home')) return '1';
    if (path.includes('/dashboard/plant-monitoring')) return '2';
    return '1'; // Default to dashboard
  };

  // Handle menu item clicks
  const handleMenuClick = ({ key }) => {
    switch (key) {
        case '1':
          history.push('/dashboard/home');
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
      style={isMobile ? { height: '100%', background: '#001529', boxShadow: '2px 0 8px rgba(0,0,0,0.15)' } : {}}
    >
      <div className={`logo${isMobile ? ' logo-mobile' : ''}`} style={isMobile ? { padding: '24px 16px 12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' } : {}}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!collapsed ? (
          <img 
            src={logoFull} 
            alt="FusionSolar Logo" 
            className="logo-full d-none d-md-block"
          />
        ) : (
          <img 
            src={logoSmall} 
            alt="Logo" 
            className="logo-small"
          />
        )}
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
          {
            key: '2',
            icon: <BarChartOutlined style={isMobile ? { fontSize: 18 } : {}} />,
            label: <span style={isMobile ? { fontWeight: 600, fontSize: 15 } : {}}>Monitoring</span>,
            title: 'Monitoring',
          }
        ]}
      />
    </Sider>
  );
};

export default FusionSolarSider; 