import React from "react"
import { Button, Select } from "antd"
import { BsSearch } from "react-icons/bs"
import _ from "lodash"

import "stylesheets/components/search/index.scss"

const { Option } = Select

const SearchForm = ({
  searchParams,
  topOptions = [10, 25, 50, 100],
  containerClass,
  containerStyle,
  isJSONTableData,
  defaultValuePageOption,
  outerlayerClass,

  getTableData,
  onChangeSearchParams,
  onChangePageOptions,
  showGoButton,
  hideSearch,
  hidePagination
}) => {
  const onChangeTextParams = (val, index) => {
    let temp = _.cloneDeep(searchParams)
    let text = _.findIndex(temp, { value: index })
    temp[text].param = val
    onChangeSearchParams(temp)
  }

  const onToggleClearFilter = () => {
    let temp = _.cloneDeep(searchParams)
    temp.map(searchParam => {
      searchParam.param = ""
      return searchParam
    })
    onChangeSearchParams(temp)
    getTableData()
  }

  const onFetchTableData = param => {
    if (isJSONTableData) {
      let search = {}
      param.map(item => {
        if (item.param) {
          search[item.value] = item.param
        }
      })
      getTableData(search)
    } else {
      let search = ""
      param.map(item => {
        if (item.param) {
          search += `${item.value}=${item.param}&`
        }
      })
      getTableData(search)
    }
  }
  return (
    <>
      {searchParams?.length > 0 && (
        <div className={`d-flex align-items-center ${outerlayerClass || "justify-content-between"}`}>
          {!hideSearch && (
            <>
              {searchParams.map((searchParam, index) => {
                let typingTimer;
                return (
                  <div key={index} className={`search-cont ${containerClass}` || "search-cont"} style={containerStyle || {}}>
                    <div className="search-form-text" style={searchParam.style || {}}>
                      <BsSearch style={{ minWidth: "12px" }} />
                      <input
                        type="text"
                        className={searchParam.classname}
                        style={searchParam.style || { maxWidth: "250px", width: "100%" }}
                        placeholder={searchParam.placeholder || "Search..."}
                        value={searchParam.param}
                        onChange={e => {
                          onChangeTextParams(e.target.value, searchParam.value)
                        }}
                        onKeyUp={() => {
                          clearTimeout(typingTimer);
                          typingTimer = setTimeout(
                            () => onFetchTableData(searchParams),
                            500
                          );
                        }}
                        onKeyDown={() => clearTimeout(typingTimer)}
                      />
                    </div>
                    {showGoButton && (
                      <Button
                        onClick={() => {
                          if (searchParam.value === "") {
                            onToggleClearFilter()
                          }
                          _.debounce(function () {
                            onFetchTableData(searchParams)
                          }, 500)
                        }}>
                        Go
                      </Button>
                    )}
                  </div>
                )
              })}
            </>
          )}
          <div />
          {!hidePagination && (
            <div className="d-flex align-items-center gap-2">
              <span className={`d-flex align-item-center ${showGoButton ? "" : "pl-3"}`}>Top</span>
              <Select
                defaultValue={defaultValuePageOption || 100}
                style={{ width: 70 }}
                onChange={(val) => onChangePageOptions({ page: 1, pageSize: val })}
              >
                {topOptions.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default SearchForm
