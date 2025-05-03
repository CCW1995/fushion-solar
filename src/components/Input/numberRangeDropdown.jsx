import React, { useState, useRef, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import FormInput from './formInput';

const operators = [
  { label: '>', value: "gt" },
  { label: '≥', value: "gte" },
  { label: '<', value: "lt" },
  { label: '≤', value: "lte" },
  { label: '=', value: "is" },
]

const NumberRange = ({
  className,
  renderToggle,
  value,
  onChangeValue
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [operatorDropdownOpen, setOperatorDropdownOpen] = useState(false);
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (dropdownRef.current) {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false)
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [dropdownRef]);

  const toggleOperatorDropdown = () => setOperatorDropdownOpen((prevState) => !prevState);

  const formatDisplayValue = (operator, number) => {
    if (!operator) {
      return ""
    } 
    return `${operator.label} ${number ?? 0}`
  }

  return (
    <div ref={dropdownRef}>
      <Dropdown
        isOpen={dropdownOpen}
        className={className || ''}
        toggle={() => { }}
      >
        <DropdownToggle>
          {renderToggle(setDropdownOpen)}
        </DropdownToggle>
        <DropdownMenu style={{ height: 'fit-content' }}>
          <div className='d-flex align-items-center justify-content-center py-2' style={{ gap: 10 }}>
            <Dropdown isOpen={operatorDropdownOpen} toggle={toggleOperatorDropdown}>
              <DropdownToggle caret>{value?.operator ? value.operator.label : "Filter"}</DropdownToggle>
              <DropdownMenu>
                {
                  operators.map(operator => (
                    <DropdownItem
                      value={operator.value}
                      onClick={e => onChangeValue({ operator: operator, number: value?.number ?? 0, label: formatDisplayValue(operator, value?.number) })}>
                      {operator.label}
                    </DropdownItem>
                  ))
                }
              </DropdownMenu>
            </Dropdown>
            <FormInput
              inputSize={"sm"}
              type="text"
              value={value?.number}
              label=""
              labelClass="d-none"
              placeholder={"0.00"}
              onChangeData={(val) => onChangeValue({ operator: value?.operator, number: val, label: formatDisplayValue(value?.operator, val) })}
              onFocus={(e) => e.target.select()}
              thousandSeperator={true}
              inputClass={"text-right"}
            />
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default NumberRange;