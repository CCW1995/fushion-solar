import React, { Component } from "react";
import { connect } from "react-redux";
import Moment from "moment"
import { setPath } from "actions/path";
import { Get } from "utils/axios";
import { requestError } from "utils/requestHandler";

// Helper function to get date format based on period
function getDateFormat(period) {
  switch (period) {
    case 'daily':
      return 'YYYY-MM-DD';
    case 'monthly':
      return 'YYYY-MM';
    default:
      return 'YYYY';
  }
}

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      deviceRealTime: "0",
      plantData: {
        stationInfo: [],
        alarmCount: [],
        envBenefit: [],
      },
      plantEnergyData: {},
      plantRevenue: {}
    };

    onChangeHOC = (val, context) => this.setState({ [context]: val });

    load = (val) => this.setState({ loading: val })

    // Plant overview data
    getPlantView = (name) => {
      Get(
        `/station/overview?stationName=${name}`,
        this.getPlantViewSuccess,
        this.getPlantViewError,
        this.load
      )
    }

    getPlantViewSuccess = (payload) => {
      this.setState({
        plantData: payload
      })
    }

    getPlantViewError = (error) => requestError(error, "Error")

    // Plant energy data
    getPlantEnergyData = (name, period, date) => {
      const dateParam = date ? `&date=${Moment(new Date(date)).format(getDateFormat(period))}` : '';
      Get(
        `/station/energy?stationName=${name}&period=${period}${dateParam}`,
        this.getPlantEnergyDataSuccess,
        this.getPlantEnergyDataError,
        this.load
      )
    }

    getPlantEnergyDataSuccess = (payload) => {
      this.setState({
        plantEnergyData: payload
      })
    }

    getPlantEnergyDataError = (error) => requestError(error, "Error")

    // Plant revenue data
    getPlantRevenue = (name, period, date) => {
      const dateParam = date ? `&date=${Moment(new Date(date)).format(getDateFormat(period))}` : '';
      Get(
        `/station/revenue?stationName=${name}&period=${period}${dateParam}`,
        this.getPlantRevenueSuccess,
        this.getPlantRevenueError,
        this.load
      )
    }

    getPlantRevenueSuccess = (payload) => {
      this.setState({
        plantRevenue: payload
      })
    }

    getPlantRevenueError = (error) => requestError(error, "Error")

    // Device real-time data
    getdeviceRealTime = (name) => {
      Get(
        `/device/realtime?userName=${name}`,
        this.getdeviceRealTimeSuccess,
        this.getdeviceRealTimeError,
        this.load
      )
    }

    getdeviceRealTimeSuccess = (payload) => {
      this.setState({
        deviceRealTime: payload?.[0] ?? "0"
      })
    }

    getdeviceRealTimeError = (error) => requestError(error, "Error")

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onLoadPlantView={this.state.loading}
          onChangeHOC={this.onChangeHOC}
          getPlantView={this.getPlantView}
          getPlantEnergyData={this.getPlantEnergyData}
          getPlantRevenue={this.getPlantRevenue}
          getdeviceRealTime={this.getdeviceRealTime}
        />
      );
    };
  }
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps, { setPath })(WithHOC);
};

export default HOC;