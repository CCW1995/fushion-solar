import React from 'react';
import { Layout, Button, Avatar, Dropdown, Badge, Menu } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  GlobalOutlined,
  QuestionCircleOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { clearItem } from 'utils/tokenStore';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const FusionSolarHeader = ({ collapsed, setCollapsed, isMobile, onMenuClick }) => {
  const handleLogout = () => {
    clearItem('ERP_ACCESS_TOKEN');
    window.location.href = '/login';
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/dashboard/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="settings">
        <Link to="/dashboard/settings">Settings</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
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
    <Header className="fusion-header">
      <div className="header-left">
        {isMobile ? (
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="trigger mobile-trigger"
            onClick={onMenuClick}
            style={{ fontSize: 22, marginRight: 12 }}
          />
        ) : (
          React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })
        )}
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
  );
};

export default FusionSolarHeader; 