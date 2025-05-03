import React, { useState, useRef, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const CustomDropdown = ({
  className,
  renderToggle,
  dropDownOptions,
  optionValueKey,
  optionLabelKey,

  onChangeValue
}) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onChangeDropDown = (value) => {
    onChangeValue(value);
    setDropdownOpen(false);
  }

  const dropdownRef = useRef(null)

  useEffect(() => {
    if(dropdownRef.current){
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

  return(
    <div ref={dropdownRef}>
      <Dropdown
        isOpen={dropdownOpen}
        className={ className || '' }
        toggle={() => {}}
      >
        <DropdownToggle>
          {renderToggle(setDropdownOpen)}
        </DropdownToggle>
        <DropdownMenu style={{ maxHeight: '150px', overflowY: 'scroll' }}>
          {dropDownOptions.map((option, index) => (
            <DropdownItem
              key={ index }
              value={ optionValueKey ? option[optionValueKey] : option.value }
              header={ option.header || false }
              divider={ option.divider || false }
              disabled={ option.disabled || false }
              onClick={ e => onChangeDropDown( e.target.value )}>
              { optionLabelKey ? option[optionLabelKey] : option.label }
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default CustomDropdown;