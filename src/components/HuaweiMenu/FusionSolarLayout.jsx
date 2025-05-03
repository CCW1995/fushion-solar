import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, ConfigProvider } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  BarChartOutlined,
  CloudOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  GlobalOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './FusionSolarLayout.scss';

// Import logos
import logoFull from '../../assets/logo.svg';
import logoSmall from '../../assets/logo-small.svg';

const { Header, Sider, Content } = Layout;

const FusionSolarLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/dashboard/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="settings">
        <Link to="/dashboard/settings">Settings</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <Link to="/login">Logout</Link>
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu className="notification-dropdown">
      <Menu.Item key="notification-title" className="notification-title">
        <div>
          <span>Notifications</span>
          <Button type="link">Mark all as read</Button>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="notification1">
        <div className="notification-item">
          <div className="notification-content">
            <span className="notification-message">System maintenance scheduled for tonight</span>
            <span className="notification-time">2 hours ago</span>
          </div>
        </div>
      </Menu.Item>
      <Menu.Item key="notification2">
        <div className="notification-item">
          <div className="notification-content">
            <span className="notification-message">Energy production exceeded target</span>
            <span className="notification-time">5 hours ago</span>
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="view-all">
        <Link to="/dashboard/notifications">View all notifications</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 2,
        },
        components: {
          Card: {
            colorBgContainer: 'transparent',
            colorBorderSecondary: 'transparent',
          },
        }
      }}
    >
      <Layout className="fusion-layout huawei-layout">
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
            defaultSelectedKeys={['1']}
            className="fusion-menu"
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
              },
              {
                key: '3',
                icon: <CloudOutlined />,
                label: 'Device Management',
                title: 'Device Management',
              },
              {
                key: '4',
                icon: <SettingOutlined />,
                label: 'Operation & Maintenance',
                title: 'Operation & Maintenance',
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header className="fusion-header">
            <div className="header-left">
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
              })}
              <div className="breadcrumb">
                <span>Dashboard</span>
              </div>
            </div>
            <div className="header-right">
              <div className="header-actions">
                <Dropdown 
                  overlay={notificationMenu} 
                  trigger={['click']}
                  placement="bottomRight"
                  arrow
                >
                  <Badge count={13} size="small">
                    <Button 
                      type="text" 
                      icon={<BellOutlined />} 
                      className="header-action-button"
                    />
                  </Badge>
                </Dropdown>
                <Button 
                  type="text" 
                  icon={<QuestionCircleOutlined />} 
                  className="header-action-button"
                />
                <Button 
                  type="text" 
                  icon={<GlobalOutlined />} 
                  className="header-action-button"
                />
                <Dropdown 
                  overlay={userMenu} 
                  trigger={['click']}
                  placement="bottomRight"
                  arrow
                >
                  <div className="user-profile">
                    <Avatar icon={<UserOutlined />} />
                    <span className="username">Admin</span>
                  </div>
                </Dropdown>
              </div>
            </div>
          </Header>
          <Content className="fusion-content">
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default FusionSolarLayout; 