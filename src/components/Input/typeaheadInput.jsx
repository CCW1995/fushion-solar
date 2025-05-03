import _ from "lodash"
import React, { useState, useRef, useEffect } from "react"
import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead"
import { UncontrolledTooltip, Input } from "reactstrap"
import { BsCheck } from "react-icons/bs"
import moment from "moment"

import ERPIcon from "components/Icon"

import { thousandSeparatorFormatter, sanitizePriceInput } from "utils/thousandSeparator"

import "./index.scss"
import "react-bootstrap-typeahead/css/Typeahead.css"

const InputContent = ({
  value,
  onFocus,
  defaultSelected,
  disabled, // boolean
  context,
  options, // [{ value: "one", supply_id: "One", company: "One" }]
  filterBy, // ["supply_id"]
  labelKey, // "supply_id"
  valueKey, // "id"
  childKey, // "child_account_groups"
  columnData, // [{ col: 6, label: "Supply ID", key: "supply_id" }, { col: 6, label: "Item Brand", key: ["item_group" , "item_brand" , "name"] }, { col: 6, label: "QTY.", key: "quantity", align: "center" }] 
  placeholder,
  onInputChange,
  onChangeData,
  inputStyle,
  inputClass,
  inputSize //sm
}) => {
  const [inputValue, setInputValue] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [displayedOptions, setDisplayedOptions] = useState([])
  const [mobileView, setMobileView] = useState(false)
  const [sortConfig, setSortConfig] = useState({ columnKey: null, direction: "asc" })

  const typeaheadRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth <= 768)
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (options?.length > 0) {
      setDisplayedOptions(options?.slice(0, 20) ?? [])
    } else {
      setDisplayedOptions([])
    }
  }, [options])

  useEffect(() => {
    if (typeaheadRef.current) {
      const handleClickOutside = (event) => {
        if (typeaheadRef.current && !typeaheadRef.current.contains(event.target)) {
          setIsMenuOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [typeaheadRef])

  const getKeyData = (result, keys, dateFormat) => {
    if (Array.isArray(keys)) {
      let value = result
      for (let key of keys) {
        if (value && typeof value === "object" && key in value) {
          // if the key is found in an object
          if (key.toLowerCase().includes("date")) {
            value = moment(value[key]).format(dateFormat ?? "DD/MM/YYYY")
          } else if (key.toLowerCase().includes("created_at")) {
            value = moment(value[key]).format(dateFormat ?? "DD/MM/YYYY hh:mma")
          } else {
            value = value[key] || "-"
          }
        } else {
          // if the key is found in an array
          if (Array.isArray(value)) {
            value = value.map((item) => getKeyData(item, key, dateFormat))
          } else {
            return undefined
          }
        }
      }
      return value
    } else {
      if (keys.toLowerCase().includes("date")) {
        return moment(result[keys]).format(dateFormat ?? "DD/MM/YYYY")
      } else if (keys.toLowerCase().includes("created_at")) {
        return moment(result[keys]).format(dateFormat ?? "DD/MM/YYYY hh:mma")
      } else {
        return result[keys] || "-"
      }
    }
  }

  const getSortValue = (value, dataType) => {
    if (dataType === "decimal") {
      return sanitizePriceInput(value) || 0
    }
    if (dataType === "integer") {
      const numberValue = parseFloat(value)
      return isNaN(numberValue) ? 0 : numberValue
    }
    if (dataType === "date") {
      return moment(value, "YYYY-MM-DD").toDate()
    }
    return value ? value.toString() : ""
  }

  const handleSort = (columnKey) => {
    const columnConfig = columnData.find(item => item.key === columnKey)
    const dataType = columnConfig?.type || "string"

    const direction = sortConfig.columnKey === columnKey && sortConfig.direction === "asc" ? "desc" : "asc"

    setSortConfig({
      columnKey,
      direction,
    })

    const sortedOptions = [...options].sort((a, b) => {
      const aValue = getSortValue(a[columnKey], dataType)
      const bValue = getSortValue(b[columnKey], dataType)

      if (dataType === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return direction === "asc" ? aValue - bValue : bValue - aValue
      }
    })

    setDisplayedOptions(sortedOptions)
  }

  const handleScroll = (e) => {
    const threshold = 2
    const bottom = Math.abs(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight) <= threshold

    if (bottom && displayedOptions.length < options.length) {
      setDisplayedOptions(options.slice(0, displayedOptions.length + 100))
    }
  }

  return (
    <div ref={typeaheadRef}>
      <Typeahead
        disabled={disabled}
        maxResults={999}
        paginate={false}
        ref={inputRef}
        id={`form-typeahead-${context}`}
        className={`custom-form-typeahead 
          ${inputClass || ""} 
          ${inputSize ? `custom-form-typeahead-${inputSize}` : ""}
          ${!_.isEmpty(value) ? ` custom-form-typeahead-selected` : ""}
        `}
        placeholder={!disabled ? placeholder : ""}
        defaultSelected={defaultSelected || []}
        selected={value || []}
        inputValue={inputValue}
        onInputChange={val => {
          onInputChange && onInputChange(val)
          setInputValue(val)
          setIsMenuOpen(true)
        }}
        onChange={val => {
          onChangeData(val)
          setInputValue("")
          setIsMenuOpen(false)
        }}
        onKeyDown={e => {
          if (e && e.metaKey && e.key == "v") {
            setInputValue(e.target.value)
          }
        }}
        flip={true}
        filterBy={filterBy}
        labelKey={labelKey}
        onBlur={() => {
          setIsMenuOpen(false)

          if (_.isEmpty(value) && typeaheadRef.current) {
            inputRef.current.clear()
          }
        }}
        onFocus={() => {
          onFocus && onFocus()
          if (disabled) {
            return
          }
          setIsMenuOpen(true)
        }}
        options={options || []}
        open={isMenuOpen}
        renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
          return (
            <>
              <div
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="custom-typeahead-form-control"
                ref={(input) => {
                  if (input) {
                    inputRef(input)
                    referenceElementRef(input)
                  }
                }}
                id={`form-input-${context ? context.replace(".", "-") : ""}`}
                style={{ background: disabled ? "#e9ecef" : "#fff", ...inputStyle }}
                onClick={() => {
                  if (disabled) {
                    return
                  }
                  setIsMenuOpen(true)
                }}
              >
                <Input
                  {...inputProps}
                  className={""}
                />
                <div onClick={() => {
                  !disabled && setIsMenuOpen(!isMenuOpen)
                }}>
                  <ERPIcon
                    custom="dots-horizontal"
                    style={disabled ? { cursor: "not-allowed" } : { cursor: "pointer" }}
                    className="mr-2"
                  />
                </div>
              </div>
              {
                (showTooltip && inputProps.value) && (
                  <UncontrolledTooltip target={`form-input-${context?.replace(".", "-") ?? ""}`} placement="top">
                    {inputProps.value}
                  </UncontrolledTooltip>
                )
              }
            </>
          )
        }}
        renderMenu={(results, menuProps) => {
          let menuWidth = 0
          columnData.map((item) => {
            menuWidth += item.col * (mobileView ? 35 : 40)
          })

          return (
            <Menu {...menuProps} style={{ width: menuWidth + (mobileView ? 30 : 52) }} onScroll={handleScroll}>
              <div className="custom-form-header">
                <div style={{ width: 20 }}></div>
                {columnData.map((item) => (
                  <div
                    key={item.key}
                    style={{
                      width: item.col * (mobileView ? 35 : 40),
                      textAlign: item.align ?? "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                    onClick={() => handleSort(item.key)}
                  >
                    {item.label}
                    {!item.hideSorter && (
                      <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                        <ERPIcon
                          antIcon="CaretUpOutlined"
                          className="custom-sort-arrow"
                          style={{
                            marginLeft: 8,
                            color: sortConfig.columnKey === item.key && sortConfig.direction === "asc" ? "#1890ff" : "#aaa"
                          }}
                        />
                        <ERPIcon
                          antIcon="CaretDownOutlined"
                          className="custom-sort-arrow"
                          style={{
                            marginLeft: 8,
                            color: sortConfig.columnKey === item.key && sortConfig.direction === "desc" ? "#1890ff" : "#aaa"
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {[... (!inputValue) ? displayedOptions : results].map((result, index) => {
                let check = value[0]
                  ? valueKey
                    ? value[0][valueKey] === result[valueKey]
                    : value[0][labelKey] === result[labelKey]
                  : false

                return (
                  <>
                    {childKey && (
                      <>
                        <MenuItem key={`typehead_${result}_${index}`} option={result} position={index} className="p-0">
                          <div className="custom-form-typeahead-category">
                            {result[labelKey]}
                          </div>
                        </MenuItem>
                        {result[childKey] && result[childKey].map((child, childIndex) => {
                          let checkChild = value[0]
                            ? valueKey
                              ? value[0][valueKey] === child[valueKey]
                              : value[0][labelKey] === child[labelKey]
                            : false
                          return (
                            <MenuItem key={`typehead_${result}_${index}_${child}_${childIndex}`} option={child} position={childIndex} className="p-0">
                              <div className="custom-form-typeahead-item">
                                <div style={{ width: 20 }}>
                                  {checkChild ? <BsCheck /> : ""}
                                </div>
                                {columnData.map((item) => (
                                  <div style={{ width: item.col * (mobileView ? 35 : 40), fontWeight: 400, textAlign: item.align ?? "left" }}>
                                    {item.decimal ? thousandSeparatorFormatter(child[labelKey]) : child[labelKey]}
                                  </div>
                                ))}
                              </div>
                            </MenuItem>
                          )
                        })}
                      </>
                    )}
                    {!childKey && (
                      <MenuItem key={`typehead_${result}_${index}`} option={result} position={index} className="p-0">
                        <div className="custom-form-typeahead-item">
                          <div style={{ width: 20 }}>
                            {check ? <BsCheck /> : ""}
                          </div>
                          {columnData.map((item) => (
                            <div style={{ width: item.col * (mobileView ? 35 : 40), textAlign: item.align ?? "left" }}>
                              {item.renderContent
                                ? item.renderContent(result)
                                : item.decimal
                                  ? thousandSeparatorFormatter(getKeyData(result, item.key, item.dateFormat) || "0.00")
                                  : getKeyData(result, item.key, item.dateFormat)
                              }
                            </div>
                          ))}
                        </div>
                      </MenuItem>
                    )}
                  </>
                )
              })}
            </Menu>
          )
        }}>
      </Typeahead>
    </div>
  )
}

export default InputContent