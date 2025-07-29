import React, { Component } from "react";
import { connect } from "react-redux";

import { setPath } from "actions/path";
import { withRouter } from "react-router-dom";
import { setStationInfo } from "reducers/station";
import { Get } from "utils/axios";

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      deviceAlarmData: [],
      deviceAlarmTotal: 0,
    };

    onChangeHOC = (val, context) => this.setState({ [context]: val });

    load = (val) => this.setState({ loading: val })

    getDeviceAlarm = (params = {}) => {
      const {
        order = 'ASC',
        page = 1,
        limit = 10,
        stationName = '',
        inverterBrand = '',
        deviceSn = '',
        alarmId = '',
        alarmName = '',
        alarmStartTime = null,
        alarmEndTime = null
      } = params;

      // Build query string only with filled values
      const queryParams = [
        `order=${order}`,
        `page=${page}`,
        `limit=${limit}`,
        stationName ? `stationName=${encodeURIComponent(stationName)}` : null,
        inverterBrand ? `inverterBrand=${encodeURIComponent(inverterBrand)}` : null,
        deviceSn ? `deviceSn=${encodeURIComponent(deviceSn)}` : null,
        alarmId ? `alarmId=${encodeURIComponent(alarmId)}` : null,
        alarmName ? `alarmName=${encodeURIComponent(alarmName)}` : null,
        alarmStartTime ? `alarmStartTime=${encodeURIComponent(alarmStartTime.format('YYYY-MM-DD HH:mm:ss'))}` : null,
        alarmEndTime ? `alarmEndTime=${encodeURIComponent(alarmEndTime.format('YYYY-MM-DD HH:mm:ss'))}` : null
      ].filter(Boolean).join('&');

      Get(
        `/device/alarm/active/list?${queryParams}`,
        this.getDeviceAlarmSuccess,
        this.getDeviceAlarmError,
        this.load
      );
    }
    
    getDeviceAlarmSuccess = payload => {
      this.setState({ 
        deviceAlarmData: payload.data || [], 
        deviceAlarmTotal: payload.pageMeta?.itemCount || 0 
      })
    }
    getDeviceAlarmError = (error) => requestError(error, "Error")

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onChangeHOC={this.onChangeHOC}
          getDeviceAlarm={this.getDeviceAlarm}
        />
      );
    };
  }
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps, { setStationInfo, 
    setPath, withRouter })(WithHOC);
};

export default HOC;