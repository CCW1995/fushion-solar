import React, { Component } from "react";
import { connect } from "react-redux";
import Moment from "moment"
import { setPath } from "actions/path";
import { Get } from "utils/axios";
import { requestError } from "utils/requestHandler";
import { samplePlantData } from "./assets";

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
      deviceRealTime: "0",
      loading: false,
      showPassword: false,
      errorMessage: "",
      plantData: {
        stationInfo: [],
        alarmCount: [],
        envBenefit: [],
      },
      plantEnergyData: {},
      plantRevenue: {}
    };

    onChangeHOC = (val, context) => this.setState({ [context]: val });

    load = val => this.setState({ loading: val })

    getPlantView = name => {
      Get(
        `/station/overview?stationName=${name}`,
        this.getPlantViewSuccess,
        this.getPlantViewError,
        this.load
      )
      //this.getPlantViewSuccess()
    }
    getPlantViewSuccess = payload => {
      this.setState({
      plantData: payload
    })}
    getPlantViewError = (error) => requestError(error, "Error")

    getPlantEnergyData = (name, period, date) => {
      Get(
        `/station/energy?stationName=${name}&period=${period}${date ? `&date=${Moment(new Date(date)).format(getDateFormat(period))}` : ''}`,
        this.getPlantEnergyDataSuccess,
        this.getPlantEnergyDataError,
        this.load
      )
    }
    getPlantEnergyDataSuccess = payload => this.setState({
      plantEnergyData: payload
    })
    getPlantEnergyDataError = (error) => requestError(error, "Error")

    getPlantRevenue= (name, period, date) => {
      Get(
        `/station/revenue?stationName=${name}&period=${period}${date ? `&date=${Moment(new Date(date)).format(getDateFormat(period))}` : ''}`,
        this.getPlantRevenueSuccess,
        this.getPlantRevenueError,
        this.load
      )
    }
    getPlantRevenueSuccess = payload => this.setState({
      plantRevenue: payload
    })
    getPlantRevenueError = (error) => requestError(error, "Error")

    getdeviceRealTime = (name) => {
      Get(
        `/device/realtime?userName=${name}`,
        this.getdeviceRealTimeSuccess,
        this.getdeviceRealTimeError,
        this.load
      )
    }
    getdeviceRealTimeSuccess = payload => this.setState({
      deviceRealTime: payload?.[0]??"0"
    })
    getdeviceRealTimeError = (error) => requestError(error, "Error")

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onLoadPlantView={this.state.loading}
          onChangeHOC={this.onChangeHOC}
          getdeviceRealTime={this.getdeviceRealTime}
          getPlantView={this.getPlantView}
          getPlantEnergyData={this.getPlantEnergyData}
          getPlantRevenue={this.getPlantRevenue}
        />
      );
    };
  }
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps, { setPath })(WithHOC);
};

export default HOC;