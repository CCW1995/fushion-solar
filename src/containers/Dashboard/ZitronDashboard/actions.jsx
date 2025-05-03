import React, { Component } from "react";
import _ from 'lodash';
import { connect } from 'react-redux'
import { Get, Post, Delete } from "utils/axios";
import { setPath } from 'actions/path'
import { requestError } from "utils/requestHandler";
import { convertObjectToBase64 } from "utils/objToBase64";

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      favouriteModule: [],
    }

    load = param => this.setState({ loading: param })
    onChangeFavouriteModule = (key, val) => this.setState({ [key]: val })

    getFavouriteModule = () => Get(
      `/api/user_account_favorite_modules?query=${convertObjectToBase64({ filter: {user_account_id: this.props.data.ProfileReducer.profile.id} })}`,
      this.getFavouriteModuleSuccess,
      this.getFavouriteModuleError,
      this.load
    )
    getFavouriteModuleSuccess = response => {
      if (response.data.length > 0) {
        response.data = _.orderBy(response.data, ['module_name', "name"], ['asc'])
      }
      this.setState({ favouriteModule: response.data })
    }
    getFavouriteModuleError = error => requestError(error)

    createFavourite = module_id => Post(
      "/api/user_account_favorite_modules",
      { user_account_id: this.props.data.ProfileReducer.profile.id, module_id: module_id },
      this.createFavouriteSuccess,
      this.createFavouriteError,
      this.load
    )
    createFavouriteSuccess = () => this.getFavouriteModule()
    createFavouriteError = error => requestError(error.message, 'Error')

    deleteFavourite = id => Delete(
      `/api/user_account_favorite_modules/${id}`,
      this.deleteFavouriteSuccess,
      this.deleteFavouriteError,
      this.load
    )
    deleteFavouriteSuccess = () => this.getFavouriteModule()
    deleteFavouriteError = error => requestError(error)

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onLoadFavourite={this.state.loading}
          
          createFavourite={this.createFavourite}
          deleteFavourite={this.deleteFavourite}
          getFavouriteModule={this.getFavouriteModule}
          onChangeFavouriteModule={this.onChangeFavouriteModule}
        />
      );
    };
  }
  const mapStateToProps = state => ({ data: state })
  return connect(mapStateToProps, { setPath })(WithHOC);
};

export default HOC;
