import _ from 'lodash'
import React, { useState, useRef, useEffect } from "react"
import { Typeahead, Menu, MenuItem, Token } from "react-bootstrap-typeahead"
import { FormGroup } from 'reactstrap'

import ERPIcon from "components/Icon"
import ERPButton from "components/Button"

import moment from "moment"
import { thousandSeparatorFormatter } from 'utils/thousandSeparator';

import "./index.scss"
import 'react-bootstrap-typeahead/css/Typeahead.css'

const MultiInputContent = ({
  value,
  valueKey,
  onFocus,
  defaultSelected,
  disabled, // boolean
  context,
  options, // [{ value: "one", supply_id: "One", company: "One" }]
  labelKey, // "supply_id"
  filterBy, // ["supply_id", "company"]
  columnData, // [{ col: 6, label: "Supply ID", key: "supply_id" }, { col: 6, label: "Item Brand", key: ["item_group" , "item_brand" , "name"] }] 
  placeholder,
  onInputChange,
  onChangeData,
  inputStyle,
  inputClass,
  inputSize, //sm
  clearSelection,
  refreshData
}) => {

  const [inputValue, setInputValue] = useState('')
  const [multiSelections, setMultiSelections] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [tempOptions, setTempOptions] = useState(options);

  const typeaheadRef = useRef(null)

  useEffect(() => {
    if (isMenuOpen && refreshData) {
      refreshData()
    }
  }, [isMenuOpen]);

  useEffect(() => {
    setTempOptions(options);
  }, [options]);

  useEffect(() => {
    if (typeaheadRef.current) {
      const handleClickOutside = (event) => {
        if (typeaheadRef.current && !typeaheadRef.current.contains(event.target)) {
          setIsMenuOpen(false)
          setInputValue("")
        }
      }

      document.addEventListener('mousedown', handleClickOutside)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [typeaheadRef])

  const getKeyData = (result, keys, dateFormat) => {
    if (Array.isArray(keys)) {
      let value = result;
      for (let key of keys) {
        if (value && typeof value === "object" && key in value) {
          if (key.toLowerCase().includes("date")) {
            value = moment(value[key]).format(dateFormat ?? "DD/MM/YYYY");
          } else if (key.toLowerCase().includes("created_at")) {
            value = moment(value[key]).format(dateFormat ?? "DD/MM/YYYY hh:mma")
          } else {
            value = value[key] || "-";
          }
        } else {
          if (Array.isArray(value)) {
            value = value.map((item) => getKeyData(item, key, dateFormat));
          } else {
            return undefined;
          }
        }
      }
      return value;
    } else {
      if (keys.toLowerCase().includes("date")) {
        return moment(result[keys]).format(dateFormat ?? "DD/MM/YYYY");
      } else if (keys.toLowerCase().includes("created_at")) {
        return moment(result[keys]).format(dateFormat ?? "DD/MM/YYYY hh:mma");
      } else {
        return result[keys] || "-";
      }
    }
  }

  useEffect(() => {
    if (clearSelection) {
      setMultiSelections([])
      clearSelection = false
    }
  }, [clearSelection]);

  useEffect(() => {
    if (!_.isEmpty(value) && _.isArray(value)) {
      if (_.every(value, _.isObject)) {
        setMultiSelections(value)
      } else {
        const selectedOptions = options.filter(option => value.includes(option[valueKey ?? ""]))
        setMultiSelections(selectedOptions)
      }
    } else if (_.isArray(value) && value.length === 0) {
      setMultiSelections([])
    }
  }, [value, options])

  return (
    <div ref={typeaheadRef}>
      <FormGroup
        className='custom-form-input'
        style={{ height: 'auto', width: "100%" }}
        onClick={() => !disabled && setIsMenuOpen(true)}
      >
        <Typeahead
          multiple
          maxResults={999}
          disabled={disabled}
          paginate={false}
          id={`form-typeahead-${context}`}
          className={`custom-form-typeahead ${inputClass || ""} ${inputSize ? `custom-form-typeahead-${inputSize}` : ''} ${!_.isEmpty(multiSelections) ? 'custom-form-typeahead-selected' : ''}`}
          placeholder={!disabled ? placeholder : ""}
          defaultSelected={defaultSelected || []}
          selected={multiSelections || []}
          inputValue={inputValue}
          onInputChange={val => {
            onInputChange && onInputChange(val)
            setInputValue(val)
            setIsMenuOpen(true)
          }}
          onChange={(selections) => {
            setMultiSelections(selections)
            onChangeData(selections)
          }}
          flip={true}
          labelKey={labelKey}
          filterBy={filterBy}
          onFocus={() => {
            onFocus && onFocus()
          }}
          options={tempOptions || []}
          open={isMenuOpen}
          renderToken={(option, props, index) => {
            return (
              <Token
                key={index}
                onRemove={props.onRemove}
                option={option}
                disabled={disabled}
              >
                {option[labelKey]}
              </Token>
            )
          }}
          renderMenu={(results, menuProps) => {
            let menuWidth = 0
            columnData.map((item) => {
              menuWidth += item.col * 40
            })

            return (
              <Menu {...menuProps} style={{ width: menuWidth + 52 }}>
                <div style={{ margin: '10px auto 10px 10px' }}>
                  <ERPButton
                    color="white"
                    size="small"
                    customStyle={{ minWidth: "fit-content" }}
                    onClick={() => {
                      if (multiSelections.length !== options.length) {
                        setMultiSelections(options)
                        onChangeData(options)
                      } else {
                        setMultiSelections([])
                        onChangeData([])
                      }
                    }}>
                    {multiSelections.length !== options.length ? 'Select All' : 'Unselect All'}
                  </ERPButton>
                </div>
                <div className="custom-form-header">
                  {columnData.map((item) => (
                    <div style={{ width: item.col * 40 }}>{item.label}</div>
                  ))}
                </div>
                {results.map((result, index) => (
                  <MenuItem key={`typehead_${result}_${index}`} option={result} position={index} className="p-0">
                    <div className="custom-form-typeahead-item">
                      {columnData.map((item) => (
                        <div style={{ width: item.col * 40 }}>
                          {item.decimal ? thousandSeparatorFormatter(getKeyData(result, item.key, item.dateFormat) || "0.00") : getKeyData(result, item.key, item.dateFormat)}
                        </div>
                      ))}
                    </div>
                  </MenuItem>
                ))}
              </Menu>
            )
          }}
        />
        {!disabled && (
          <ERPIcon
            custom="dots-horizontal"
            style={{ cursor: 'pointer', marginLeft: 'auto' }}
          />
        )}
      </FormGroup>
    </div>
  )
}

export default MultiInputContent