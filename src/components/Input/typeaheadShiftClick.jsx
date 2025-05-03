import React, { useState, useRef, useEffect } from 'react';
import { Col, FormGroup, Label } from "reactstrap";
import { BsX, BsCheck } from 'react-icons/bs';
import moment from 'moment';
import _, { set } from 'lodash';

import ERPIcon from "components/Icon"
import ERPButton from "components/Button"

import { thousandSeparatorFormatter } from 'utils/thousandSeparator';

const MultiSelectTypeahead = (props) => {
  const {
    options,
    isMulti = true,
    value,
    labelKey,
    valueKey,
    filterKey,
    columnData,
    placeholder,
    hideSelectAll,
    defaultSelectAll,
    getOptionsApi,
    onChangeData,
  } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileView, setMobileView] = useState(false)
  const [allSelected, setAllSelected] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [displayedOptions, setDisplayedOptions] = useState([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (options?.length === 0 && defaultSelectAll) {
      setAllSelected(true);
    } else if (options?.length > 0 && options.length === value.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
    setSelectedItems(value);
  }, [value]);

  useEffect(() => {
    if (options?.length > 0) {
      const filteredOptions = options.filter(option => {
        if (filterKey) {
          return filterKey.some(key => option[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return option?.[labelKey || 'label']?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });

      if (defaultSelectAll && selectedItems?.length === 0) {
        setAllSelected(true);
        onChangeData(options)
        setSelectedItems(options);
      }
      setDisplayedOptions(filteredOptions?.slice(0, 20) ?? []);
    } else {
      setDisplayedOptions([]);
    }
  }, [options, searchTerm]);

  const getItemHighlightClass = (index) => {
    if (!isShiftPressed || lastSelectedIndex === -1) return '';

    const start = Math.min(lastSelectedIndex, hoverIndex);
    const end = Math.max(lastSelectedIndex, hoverIndex);

    if (index === lastSelectedIndex) return 'custom-form-typeahead-item--last-selected';
    if (index >= start && index <= end) return 'custom-form-typeahead-item--in-range';

    return '';
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
    setIsOpen(true);
  };

  const handleItemClick = (option, index, event) => {
    event.preventDefault(); // Prevent text selection during shift-click

    if (!isMulti) {
      setIsOpen(false);
      setSearchTerm('');
      onChangeData([option]);
      return;
    }

    if (event.shiftKey && lastSelectedIndex !== -1 && isMulti) {
      // Calculate range boundaries
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);

      // Get all options in the range
      const filteredOptions = options.filter(option => {
        if (filterKey) {
          return filterKey.some(key => option[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return option?.[labelKey || 'label']?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
      const rangeOptions = filteredOptions.slice(start, end + 1);

      // Combine existing selection with range selection
      const newSelection = Array.from(new Set([
        ...selectedItems,
        ...rangeOptions
      ]));

      onChangeData(newSelection);
    } else {
      // Regular click behavior
      const isSelected = selectedItems.includes(option);
      let newSelection;

      if (isSelected) {
        newSelection = selectedItems.filter(item => item !== option);
      } else {
        newSelection = [...selectedItems, option];
      }

      onChangeData(newSelection);
      setLastSelectedIndex(index); // Update last selected index only for single clicks
    }

    // this is commented because when select options, it will keep call getOptionsApi
    // inputRef.current?.focus();
  };

  const handleMouseEnter = (index) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(-1);
  };

  const removeItem = (e, itemToRemove) => {
    e.stopPropagation();
    const newSelection = selectedItems.filter(item => item !== itemToRemove);
    onChangeData(newSelection);
  };

  const getKeyData = (result, keys, dateFormat) => {
    if (Array.isArray(keys)) {
      let value = result;
      for (let key of keys) {
        if (value && typeof value === "object" && key in value) {
          // if the key is found in an object
          if (key.toLowerCase().includes("date")) {
            value = moment(value[key]).format(dateFormat ?? "DD/MM/YYYY");
          } else if (key.toLowerCase().includes("created_at")) {
            value = moment(value[key]).format(dateFormat ?? "DD/MM/YYYY hh:mma")
          } else {
            value = value[key] || "-";
          }
        } else {
          // if the key is found in an array
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

  const handleScroll = (e) => {
    const threshold = 2;
    const bottom = Math.abs(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight) <= threshold;
    const filteredOptions = options.filter(option => {
      if (filterKey) {
        return filterKey.some(key => option[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      }
      return option?.[labelKey || 'label']?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    console.log('e.target.scrollHeight', e.target.scrollHeight)
    console.log('e.target.scrollTop', e.target.scrollTop)
    console.log('e.target.clientHeight', e.target.clientHeight)
    console.log('bottom', bottom)
    console.log('displayedOptions.length', displayedOptions.length)
    console.log('filteredOptions.length', filteredOptions.length)

    if (bottom && displayedOptions.length < filteredOptions.length) {
      setDisplayedOptions(filteredOptions.slice(0, displayedOptions.length + 100));
    }
  };

  return (
    <FormGroup
      style={{ ...props.formGroupStyle, marginBottom: "6px" }}
      className={`${props.formGroupClass || ""}`}
      row={props.row || false}
      required={props.required}>
      {props.label && (
        <Label
          for={props.context}
          {...(props.row ? props.labelCol : {})}
          style={{ ...props.labelStyle }}
          className={!props.boldLabel ? `${props.labelClass || ""}` : `custom-form-label ${props.labelClass || ""}`}>
          {props.label}
          {props.required ? <span className="text-danger">*</span> : ""}
        </Label>
      )}
      <div ref={containerRef} >
        <div className="shift-click-typeahead">
          <div className="d-flex align-items-center w-100 justify-content-between position-relative">
            <div className="shift-click-typeahead__container" onClick={handleContainerClick}>
              {allSelected && (
                <span
                  key={"selected_all"}
                  className='shift-click-typeahead__tag'
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className='shift-click-typeahead__tag-text'>
                    Selected All
                  </span>
                  <BsX
                    style={{ width: 18, height: 18 }}
                    onClick={(e) => {
                      onChangeData([])
                      setAllSelected(false)
                    }}
                  />
                </span>
              )}
              {!allSelected && selectedItems?.map((item) => (
                <span
                  key={item[labelKey] || item}
                  className='shift-click-typeahead__tag'
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className='shift-click-typeahead__tag-text'>
                    {item[labelKey] || item?.label}
                  </span>
                  <BsX
                    style={{ width: 18, height: 18 }}
                    onClick={(e) => removeItem(e, item)}
                  />
                </span>
              ))}
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                className='rbt-input-main'
                style={(selectedItems?.length === 0 && !allSelected) ? { width: '100%' } : { width: 50 }}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => {
                  if (getOptionsApi) {
                    getOptionsApi();
                  }
                  setIsOpen(true);
                }}
                placeholder={(selectedItems?.length === 0 && !allSelected)
                  ? (placeholder || 'Type to search...')
                  : ''}
              />

            </div>
            <ERPIcon
              custom="dots-horizontal"
              style={{ cursor: 'pointer', marginLeft: 'auto' }}
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>
        {isOpen && (
          <div
            className='shift-click-typeahead__menu'
            onScroll={handleScroll}
            style={{ width: columnData.reduce((acc, item) => acc + item.col, 0) * (mobileView ? 35 : 40) }}>
            {!hideSelectAll && (
              <div style={{ margin: '10px auto 10px 10px' }}>
                <ERPButton
                  color="white"
                  size="small"
                  customStyle={{ minWidth: "fit-content" }}
                  onClick={() => {
                    if (options?.length > 0 && selectedItems?.length !== options?.length) {
                      onChangeData(options)
                      setIsOpen(false)
                    } else {
                      onChangeData([])
                      setAllSelected(false)
                    }
                  }}>
                  {selectedItems?.length !== options?.length ? 'Select All' : 'Unselect All'}
                </ERPButton>
              </div>
            )}
            <div className="custom-form-header">
              <div style={{ width: 20 }}></div>
              {columnData.map((item) => (
                <div
                  key={item.value}
                  style={{
                    width: item.col * (mobileView ? 35 : 40),
                    textAlign: item.align ?? "left",
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  {item.label}
                </div>
              ))}
            </div>
            {displayedOptions.length > 0 && displayedOptions.map((option, index) => {
              let check = allSelected || (selectedItems?.length > 0
                ? (valueKey
                  ? _.find(selectedItems, (item) => item[valueKey] === option[valueKey])
                  : _.find(selectedItems, (item) => item[labelKey] === option[labelKey]))
                : false);

              return (
                <div
                  key={option[labelKey] || option}
                  className={`custom-form-typeahead-item ${getItemHighlightClass(index)}`}
                  onClick={(e) => handleItemClick(option, index, e)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div style={{ width: 20 }}>
                    {check ? <BsCheck /> : ""}
                  </div>
                  {columnData.map((item) => (
                    <div style={{ width: item.col * (mobileView ? 35 : 40), textAlign: item.align ?? "left" }}>
                      {item.renderContent
                        ? item.renderContent(option)
                        : item.decimal
                          ? thousandSeparatorFormatter(getKeyData(option, item.key, item.dateFormat) || "0.00")
                          : getKeyData(option, item.key, item.dateFormat)
                      }
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>
      {props.labelAfterInput && (
        <Col {...(props.row && props.labelAfterInputCol)} className="d-flex align-items-center">
          {props.labelAfterInput}
        </Col>
      )}
    </FormGroup>
  );
};

export default MultiSelectTypeahead;