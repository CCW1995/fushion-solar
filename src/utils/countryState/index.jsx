import _ from 'lodash'
import { Country, State, City } from 'country-state-city'
import {
  PahangCities,
  WilayahCities,
  ExtraHKState,
  ExtraMalaysiaCities,
  NameCorrectionDictionary
} from './assets'

const cityRenameHandler = (countryCode, city) => {
  let tempName = city.name

  if (countryCode === 'MY' || countryCode === 'HK') {
    let tempFind = _.find(NameCorrectionDictionary, { originalName: city.name })

    if (tempFind) {
      tempName = tempFind.name
    }
  }

  return ({
    ...city,
    name: tempName
  })
}

const stateRenameHandler = (countryCode, state) => {
  let tempName = state.name

  if (countryCode === 'MY' && state.isoCode === "04") {
    tempName = 'Melaka'
  }

  if (countryCode === 'MY' && state.isoCode === "07") {
    tempName = 'Pulau Pinang'
  }

  if (countryCode === 'HK', state.isoCode === 'KKC') {
    tempName = 'Kowloon City'
  }

  return ({
    ...state,
    name: tempName
  })
}

export const getCountryData = () => Country.getAllCountries().map(country => ({
  label: country.name,
  value: country.name,
  id: country.isoCode
}))

export const getStateData = countryCode => {
  if (countryCode) {

    let temp = State.getStatesOfCountry(countryCode)

    if (countryCode === 'HK') {
      temp = [
        ...temp,
        ...ExtraHKState
      ]
    }

    return temp.map(state => {
      let tempState = stateRenameHandler(countryCode, state)

      return ({
        value: tempState.name,
        label: tempState.name,
        id: tempState.isoCode
      })
    })
  }

  return []
}

export const getCityData = (countryCode, cityCode) => {
  if (countryCode && cityCode) {
    let tempCities = City.getCitiesOfState(countryCode, cityCode)

    if (countryCode === 'MY' && cityCode === '06') {
      tempCities = PahangCities
    }

    else if (countryCode === 'MY' && cityCode === '16') {
      tempCities = WilayahCities
    }

    else if (countryCode === 'MY' && cityCode === '01') {
      tempCities = [
        ...City.getCitiesOfState(countryCode, cityCode).filter(child => child.name.indexOf('Daerah') < 0),
        ...ExtraMalaysiaCities?.[cityCode] ?? []
      ]
    }

    else if (countryCode === 'HK' && tempCities.length < 1) {
      let tempStates = State.getStatesOfCountry(countryCode)
      let tempState = _.find(tempStates, { isoCode: cityCode })

      tempCities = [tempState ? tempState : { name: 'New Territories' }]
    }

    else if (countryCode === 'CZ' && tempCities.length < 1) {
      let tempStates = State.getStatesOfCountry(countryCode)
      let tempState = _.find(tempStates, { isoCode: cityCode })

      tempCities = [tempState]
    }

    else {
      tempCities = [
        ...City.getCitiesOfState(countryCode, cityCode),
        ...ExtraMalaysiaCities?.[cityCode] ?? []
      ]
    }

    return _.orderBy(tempCities, ['name']).map(city => {
      let tempCity = cityRenameHandler(countryCode, city)

      return ({
        value: tempCity.name,
        label: tempCity.name
      })
    })
  }

  return []
}

