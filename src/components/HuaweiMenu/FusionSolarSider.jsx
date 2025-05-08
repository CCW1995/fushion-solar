import React from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  BarChartOutlined,
  CloudOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link, useHistory, useLocation } from 'react-router-dom';

// Import logos
import logoFull from '../../assets/logo.svg';
import logoSmall from '../../assets/logo-small.svg';

const { Sider } = Layout;

const FusionSolarSider = ({ collapsed, setCollapsed }) => {
  const history = useHistory();
  const location = useLocation();

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
        history.push('/dashboard/huawei-dashboard');
    }
  };

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      className="fusion-sider"
      width={220}
    >
      <div className="logo">
        {!collapsed ? (
          <img 
            src={logoFull} 
            alt="FusionSolar Logo" 
            className="logo-full"
          />
        ) : (
          <img 
            src={logoSmall} 
            alt="Logo" 
            className="logo-small"
          />
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        className="fusion-menu"
        onClick={handleMenuClick}
        items={[
          {
            key: '1',
            icon: <HomeOutlined />,
            label: 'Dashboard',
            title: 'Dashboard',
          },
          {
            key: '2',
            icon: <BarChartOutlined />,
            label: 'Monitoring',
            title: 'Monitoring',
          }
        ]}
      />
    </Sider>
  );
};

export default FusionSolarSider; 