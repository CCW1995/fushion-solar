import React, { useState } from 'react';
import { Layout, ConfigProvider } from 'antd';
import FusionSolarSider from './FusionSolarSider';
import FusionSolarHeader from './FusionSolarHeader';
import './FusionSolarLayout.scss';

const { Content } = Layout;

const FusionSolarLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

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
        <FusionSolarSider collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout className="site-layout">
          <FusionSolarHeader collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content className="fusion-content">
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default FusionSolarLayout; 