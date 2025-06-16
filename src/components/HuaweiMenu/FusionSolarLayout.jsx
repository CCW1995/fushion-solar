import React, { useState } from 'react';
import { Layout, ConfigProvider, Drawer, Grid } from 'antd';
import FusionSolarSider from './FusionSolarSider';
import FusionSolarHeader from './FusionSolarHeader';
import './FusionSolarLayout.scss';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const FusionSolarLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

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
        {isMobile ? (
          <Drawer
            placement="left"
            closable={false}
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            bodyStyle={{ padding: 0 }}
            width={220}
          >
            <FusionSolarSider collapsed={false} setCollapsed={() => {}} isMobile onClose={() => setDrawerVisible(false)} />
          </Drawer>
        ) : (
          <FusionSolarSider collapsed={collapsed} setCollapsed={setCollapsed} />
        )}
        <Layout className="site-layout">
          <FusionSolarHeader
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            isMobile={isMobile}
            onMenuClick={() => setDrawerVisible(true)}
          />
          <Content className="fusion-content">
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default FusionSolarLayout; 