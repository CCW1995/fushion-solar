import React, { forwardRef } from "react";
import { BsPlusCircle, BsSearch, BsX } from "react-icons/bs";
import ReactDatePicker from "react-datepicker";
import { Select } from "antd"
import _ from "lodash";

import CustomCheckBox from "components/Input/checkbox"
import CustomDropdown from "components/Dropdown";

import "./index.scss";
import { formatPlaceholder } from "utils/stringFormatter";
import SelectMulti from "components/Input/selectMulti";
import NumberRange from "../Input/numberRangeDropdown"

const { Option } = Select

// SearchParams
// [{
//   label: "Organisation",
//   type: "dropdown",
//   value: "org",
//   param: "",
//   optionValueKey: "value", //optional, default: "value"
//   optionLabelKey: "label", //optional, default: "label"
//   options: [
//     { label: 'ABC', value: 'abc'},
//     { label: 'DEF', value: 'def'},
//     { label: 'GHI', value: 'ghi'},
//   ],
// }, {
//   label: "Date",
//   type: "date",
//   value: "date",
//   param: new Date(),
// }, {
//   label: "Name",
//   type: "text",
//   value: "name",
//   param: "",
// }]

const SearchForm = ({
  searchParams,
  isJSONTableData,
  showFilterLabel = true,
  showClearFilterButton = true,
  showPageFilter = false,
  showGoButton,
  defaultValuePageOption,
  customSearchStyle,

  onChangeHOC,
  getTableData,
  onChangeSearchParams,
  onChangePageOptions
}) => {
  const CustomDateInput = forwardRef(({ value, onClick, label }, ref) => (
    <button className="btn p-0" onClick={onClick} ref={ref}>
      <BsPlusCircle /> {label || "Date"}
      {value ? ": " + value : ""}
    </button>
  ));

  const onChangeSection = (val) => {
    onChangeHOC("selectedSection", val);
    onToggleClearFilter();
  };

  const onChangeParams = (val, context) => {
    let temp = _.cloneDeep(searchParams);
    let indexes = searchParams.reduce((r, param, i) => (param.value == context && r.push(i), r), []);
    for (let index of indexes) {
      temp[index].param = val;
      if (temp[index].onChange) {
        temp[index].onChange(temp)
      }
    }
    onChangeSearchParams(temp);
    onFetchTableData(temp);
  };

  const onChangeTextParams = (val, context) => {
    let temp = _.cloneDeep(searchParams);
    let index = _.findIndex(temp, { value: context });
    temp[index].param = val;
    onChangeSearchParams(temp);
  };

  const onToggleClearFilter = () => {
    let temp = _.cloneDeep(searchParams);
    temp.map((searchParam) => {
      searchParam.param = "";
      return searchParam;
    });
    onChangeSearchParams(temp);
    getTableData();
  };

  const onFetchTableData = (param) => {
    if (isJSONTableData) {
      let search = {};
      param.map((item) => {
        if (item.param) {
          if (item.type == "numberrange") {
            if (item.param.operator && !_.isEmpty(item.param.label)) {
              search[`${item.value}__${item.param.operator.value}`] = Number(item.param.number)
            }
          } else if (!item.values) {
            search[item.value] = item.param;
          } else {
            search["__or"] = {}
            for (const value of item.values) {
              if (typeof value === "string") {
                search["__or"][value] = item.param
              } else if (Array.isArray(value) && value.length === 2) {
                const literalText = value[1].replace("{{placeholder}}", item.param)
                search["__or"][value[0]] = literalText
              }
            }
          }
        }
      });
      getTableData(search);
    } else {
      let search = "";
      param.map((item) => {
        if (item.param) {
          search += `${item.value}=${item.param}&`;
        }
      });
      getTableData(search);
    }
  };
  return (
    <>
      <div className="custom-search-cont" style={customSearchStyle}>
        {searchParams?.length > 0 && (
          <>
            {showFilterLabel && <span>Filter</span>}
            {searchParams.map((searchParam, index) => {
              if (searchParam.type === "date") {
                const currentYear = new Date().getFullYear();
                const minDate = new Date(currentYear - 5, 0, 1); 
                const maxDate = new Date(currentYear + 5, 11, 31);

                return (
                  <div
                    key={index}
                    className={`custom-search-form ${!searchParam.param && "custom-search-form-null"
                      }`}>
                    <ReactDatePicker
                      selected={searchParam.param}
                      customInput={<CustomDateInput label={searchParam.label} />}
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      minDate={minDate}
                      maxDate={maxDate}
                      onChange={(date) => onChangeParams(date, searchParam.value)}
                      dateFormat={searchParam.dateFormat || "dd/MM/yyyy"}
                      className="custom-datepicker"
                      calendarClassName="custom-calendar"
                      popperClassName="custom-popper"
                      portalClassName="custom-calendar-dropdown"
                    />
                    {searchParam.param && <BsX style={{ marginLeft: 8, width: 18, height: 18 }} onClick={() => onChangeParams("", searchParam.value)} />}
                  </div>
                );
              } else if (searchParam.type === "checkbox") {
                return (
                  <>
                    <CustomCheckBox
                      checkboxClass={"text-light-grey text-sm my-1"}
                      formGroupClass={'mb-0'}
                      label={searchParam.label}
                      context="status"
                      checked={searchParam.param}
                      onChangeData={(val) => {
                        onChangeParams(
                          !searchParam.param,
                          searchParam.value
                        );
                      }}
                    />
                    {searchParam.param && <BsX style={{ marginLeft: 8, width: 18, height: 18 }} onClick={() => onChangeParams("", searchParam.value)} />}
                  </>
                );
              } else if (searchParam.type === "dropdown") {

                return (
                  <CustomDropdown
                    key={index}
                    className={`custom-search-form ${!searchParam.param && "custom-search-form-null"
                      }`}
                    renderToggle={(setDropdownOpen) => {
                      return (
                        <>
                          <div
                            className="d-flex align-items-center"
                            style={{ gap: 4 }}
                            onClick={() => setDropdownOpen(true)}
                          >
                            <BsPlusCircle />
                            {searchParam.label}
                            {searchParam.param && ": "}
                            {
                              _.find(searchParam.options, {
                                [searchParam.optionValueKey ? searchParam.optionValueKey : "value"]: searchParam?.isIntergerValue ? parseInt(searchParam.param) : searchParam.param,
                              })?.[searchParam.optionLabelKey ? searchParam.optionLabelKey : "label"]
                            }
                          </div>
                          {searchParam.param && <BsX style={{ marginLeft: 8, width: 18, height: 18 }} onClick={() => {
                            onChangeParams("", searchParam.value)
                            setDropdownOpen(false)
                          }} />}
                        </>
                      )
                    }}
                    dropDownOptions={searchParam.options}
                    optionLabelKey={searchParam.optionLabelKey}
                    optionValueKey={searchParam.optionValueKey}
                    onChangeValue={(val) => {
                      let tmpValue = searchParam.isIntergerValue
                        ? parseInt(val)
                        : val;
                      onChangeParams(
                        searchParam.param === tmpValue ? "" : tmpValue,
                        searchParam.value
                      );
                    }}
                  />
                );
              } else if (searchParam.type === "selectmulti") {
                return (
                  !searchParam.listingSearch ? (
                    <SelectMulti
                      listingSearch={searchParam.listingSearch}
                      options={searchParam.options}
                      value={searchParam.param !== "" ? searchParam.param : undefined}
                      filterOption={(val, option) => RegExp(val, "i").test(option.label)}
                      placeholder={searchParam.placeholder}
                      onChange={(val) => {
                        onChangeParams(
                          (val.length > 0) ? val : "",
                          searchParam.value
                        );
                      }}
                    />
                  ) : (
                    <SelectMulti
                      listingSearch={searchParam.listingSearch}
                      customClass={`custom-search-form ${!searchParam.param && "custom-search-form-null"}`}
                      options={searchParam.options}
                      value={searchParam.param !== "" ? searchParam.param : undefined}
                      filterOption={(val, option) => RegExp(val, "i").test(option.label)}
                      placeholder={searchParam.placeholder}
                      onChange={(val) => {
                        onChangeParams(
                          (val.length > 0) ? val : "",
                          searchParam.value
                        );
                      }}
                    />
                  )
                )
              } else if (searchParam.type === "numberrange") {

                return (
                  <NumberRange
                    key={index}
                    className={`custom-search-form ${!searchParam.param && "custom-search-form-null"
                      }`}
                    renderToggle={(setDropdownOpen) => {
                      return (
                        <>
                          <div
                            className="d-flex align-items-center"
                            style={{ gap: 4 }}
                            onClick={() => setDropdownOpen(true)}
                          >
                            <BsPlusCircle />
                            {searchParam.label}
                            {
                              searchParam.param
                                ? ": " + searchParam.param?.label
                                : ""
                            }
                          </div>
                          {searchParam.param && <BsX style={{ marginLeft: 8, width: 18, height: 18 }} onClick={() => {
                            onChangeParams("", searchParam.value)
                            setDropdownOpen(false)
                          }} />}
                        </>
                      )
                    }}
                    value={searchParam.param}
                    onChangeValue={(val) => onChangeParams(val, searchParam.value)}
                  />
                );
              } else {
                let typingTimer;
                return (
                  <div key={index} className={`custom-search-form-text`}>
                    <BsSearch />
                    <input
                      type="text"
                      placeholder={
                        searchParam.placeholder && searchParam.customize
                          ? searchParam.placeholder
                          : formatPlaceholder(searchParam.placeholder)
                      }
                      value={searchParam.param}
                      onChange={(e) => {
                        const value = e.target.value;
                        // change regex to avoid tailing and leading special characters
                        onChangeTextParams(value.replace(/'/g, ''), searchParam.value)
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
                    {searchParam.param && <BsX style={{ marginLeft: 8, width: 18, height: 18 }} onClick={() => onChangeParams("", searchParam.value)} />}
                  </div>
                );
              }
            })}
            {showClearFilterButton && (
              <span
                style={{ cursor: "pointer" }}
                onClick={() => onToggleClearFilter()}>
                Clear filter
              </span>
            )}
          </>
        )}
        {showPageFilter && (
          <>
            <span className={`d-flex align-item-center ${showGoButton ? "" : "pl-3"}`}>Show</span>
            <Select
              className={`d-flex align-item-center`}
              defaultValue={defaultValuePageOption || 10}
              style={{ width: 70, height: "auto" }}
              onChange={(val) => onChangePageOptions({ page: 1, pageSize: val })}
            >
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
          </>
        )}
      </div>
    </>
  );
};

export default SearchForm;
