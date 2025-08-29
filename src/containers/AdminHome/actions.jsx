import React, { Component } from "react";
import { connect } from "react-redux";

import { setPath } from "actions/path";
import { withRouter } from "react-router-dom";
import { setStationInfo } from "reducers/station";
import { Get } from "utils/axios";
import { requestError } from "utils/requestHandler";

function toTwoDecimalNumber(value) {
  const num = Number(value);
  return isNaN(num) ? 0 : Number(num.toFixed(2));
}

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      kpiData: {},
      deviceAlarmData: [],  
      deviceStatusData: [],
      deviceStatusTotal: 0,
      stationListData: [],
      stationListMeta: {},
      deviceAlarmTotal: 0,
      halfAnnualEnergyData: [],
    };

    onChangeHOC = (val, context) => this.setState({ [context]: val });

    load = (val) => this.setState({ loading: val })

    getKpi = () => {
      Get(
        `/station/kpi`, 
        this.getKpiSuccess, 
        this.getKpiError, 
        this.load
      )
    }
    getKpiSuccess = payload => {
      this.setState({ kpiData: {
        current_power: toTwoDecimalNumber(payload?.[0]?.current_power),
        today_power: toTwoDecimalNumber(payload?.[0]?.today_power),
        total_power	: toTwoDecimalNumber(payload?.[0]?.total_power	),
        today_income	: toTwoDecimalNumber(payload?.[0]?.today_income	),
      }})
    }
    getKpiError = (error) => requestError(error, "Error")

    getDeviceAlarm = (inverterBrand = '') => {
      const queryParams = [
        inverterBrand ? `inverterBrand=${encodeURIComponent(inverterBrand)}` : null
      ].filter(Boolean).join('&');

      const url = queryParams ? `/device/alarm/overview?${queryParams}` : `/device/alarm/overview`;
      
      Get(
        url, 
        this.getDeviceAlarmSuccess, 
        this.getDeviceAlarmError, 
        this.load
      )
    }

    
    getDeviceAlarmSuccess = payload => {
      this.setState({ deviceAlarmData: [
        {
          type: 'Critical',
          label: 'Critical',
          value: Number(payload?.[0]?.critical),
          icon: <span className="status-dot normal" style={{ backgroundColor: '#147df5' }} />  
        },
        {
          type: 'Major',
          label: 'Major',
          value: Number(payload?.[0]?.major),
          icon: <span className="status-dot faulty" style={{ backgroundColor: '#00c0c2' }} /> 
        },
        {
          type: 'Minor',
          label: 'Minor',
          value: Number(payload?.[0]?.minor),
          icon: <span className="status-dot disconnected" style={{ backgroundColor: '#e5824e' }} /> 
        },
        {
          type: 'Warning',
          label: 'Warning',
          value: Number(payload?.[0]?.warning),
          icon: <span className="status-dot disconnected" style={{ backgroundColor: '#ca7bf5' }} /> 
        }
      ], deviceAlarmTotal: Number(payload?.[0]?.total) })
    }
    getDeviceAlarmError = (error) => requestError(error, "Error")

    getDeviceStatus = (inverterBrand = '') => {
      const queryParams = [
        inverterBrand ? `inverterBrand=${encodeURIComponent(inverterBrand)}` : null
      ].filter(Boolean).join('&');

      const url = queryParams ? `/station/status/overview?${queryParams}` : `/station/status/overview`;
      
      Get(
        url, 
        this.getDeviceStatusSuccess, 
        this.getDeviceStatusError, 
        this.load
      )
    }
    getDeviceStatusSuccess = payload => {
      this.setState({ deviceStatusData: [
        { 
          type: 'Online',
          label: 'Online',
          value: Number(payload?.[0]?.online), 
          icon: <span className="status-dot normal" style={{ backgroundColor: '#147df5' }} />  
        },
        { 
          type: 'Offline', 
          label: 'Offline',
          value: Number(payload?.[0]?.offline) , 
          icon: <span className="status-dot faulty" style={{ backgroundColor: '#00c0c2' }} /> 
        },
        { 
          type: 'Alarm', 
          label: 'Alarm',
          value: Number(payload?.[0]?.alarm), 
          icon: <span className="status-dot disconnected" style={{ backgroundColor: '#e5824e' }} /> 
        },
      ], 
      deviceStatusTotal: Number(payload?.[0]?.total)
    })}
    getDeviceStatusError = (error) => requestError(error, "Error")

    getHalfAnnualEnergy = (date, inverterBrand = '') => {
      const queryParams = [
        `date=${date}`,
        inverterBrand ? `inverterBrand=${encodeURIComponent(inverterBrand)}` : null
      ].filter(Boolean).join('&');

      Get(
        `/station/energy/halfAnnual?${queryParams}`, 
        this.getHalfAnnualEnergySuccess, 
        this.getHalfAnnualEnergyError, 
        this.load
      )
    }
    
    getHalfAnnualEnergySuccess = payload => {
      this.setState({ 
        halfAnnualEnergyData: payload
      })
    }
    
    getHalfAnnualEnergyError = (error) => requestError(error, "Error")

    getStationList = (name, pageIndex, pageSize = 10, inverterBrand = '', purchaseType = '') => {
      const queryParams = [
        `page=${pageIndex}`,
        `limit=${pageSize}`,
        name ? `stationName=${encodeURIComponent(name)}` : null,
        inverterBrand ? `inverterBrand=${encodeURIComponent(inverterBrand)}` : null,
        purchaseType ? `purchaseTypes=${encodeURIComponent(purchaseType)}` : null
      ].filter(Boolean).join('&');

      Get(
        `/station/list?${queryParams}`, 
        this.getStationListSuccess, 
        this.getStationListError, 
        this.load
      )
    }
    getStationListSuccess = payload => {
      this.setState({ 
        stationListData: payload.data,
        stationListMeta: payload.pageMeta
      })
    }
    getStationListError = (error) => requestError(error, "Error")

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onLoadDashboard={this.state.loading}
          onChangeHOC={this.onChangeHOC}
          getKpi={this.getKpi}
          getDeviceStatus={this.getDeviceStatus}
          getDeviceAlarm={this.getDeviceAlarm}
          getHalfAnnualEnergy={this.getHalfAnnualEnergy}
          getStationList={this.getStationList}
        />
      );
    };
  }
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps, { setStationInfo, 
    setPath, withRouter })(WithHOC);
};

export default HOC;