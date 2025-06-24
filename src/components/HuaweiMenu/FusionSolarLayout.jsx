import React, { useState, useEffect, useDispatch } from 'react';
import { Layout, ConfigProvider, Drawer, Grid } from 'antd';
import FusionSolarSider from './FusionSolarSider';
import FusionSolarHeader from './FusionSolarHeader';
import WithStation from './action';
import LoadingOverlay from 'components/Indicator/LoadingOverlay';
import './FusionSolarLayout.scss';
import { setSelectedSite } from '../../reducers/siteSelector';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const FusionSolarLayout = ({ children, data, stationList, getStationList, onLoadStationList }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const dispatch = useDispatch();

  useEffect(() => {
    getStationList();
  }, []);

  useEffect(() => { 
    if (data.ProfileReducer?.profile?.role === 'Admin' && stationList.length > 0 && !data.SiteReducer?.selectedSite ) {
      dispatch(setSelectedSite(stationList[0].station_name));
    }
  }, [data.ProfileReducer?.profile?.role, stationList])

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
            <FusionSolarSider stationList={stationList} collapsed={false} setCollapsed={() => {}} isMobile onClose={() => setDrawerVisible(false)} />
          </Drawer>
        ) : (
          <FusionSolarSider collapsed={collapsed} setCollapsed={setCollapsed} stationList={stationList} />
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
            {
              onLoadStationList && <LoadingOverlay />
            }
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default WithStation(FusionSolarLayout); 