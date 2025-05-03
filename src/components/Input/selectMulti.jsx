import React from "react"
import { Select, Space } from "antd"
import { BsThreeDots } from "react-icons/bs"

const SelectMulti = ({
  customClass,
  customStyle,
  maxCount, //max number of items can be selected
  onChange,
  options = [],
  placeholder,
  suffixIcon,
  value,
  filterOption,
  listingSearch
}) => {
  const renderOptions = (options) => {
    return options.map((option) => {
      if (option.options) {
        return (
          //is used when there are different groups of data in an option
          <Select.OptGroup key={option.title} label={option.label}>
            {renderOptions(option.options)}
          </Select.OptGroup>
        )
      } else {
        return (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        )
      }
    })
  }

  return listingSearch ? (
    <Select
      className={customClass}
      variant="borderless"
      style={{ width: "150px", height: "25px",  ...customStyle }}
      mode="multiple" // multiple, tags
      maxCount={maxCount}
      maxTagCount="responsive"
      suffixIcon={suffixIcon ? <BsThreeDots /> : null}
      placeholder={placeholder || "Select one or many options"}
      value={value}
      onChange={(val) => onChange && onChange(val)}
      options={options}
      filterOption={filterOption}
      dropdownStyle={{ width: 300, maxHeight: 400, overflow: "auto" }}
      
    />
  ) : (
    <Space
      className={customClass}
      style={{
        ...customStyle,
        width: "100%",
      }}
      direction="vertical"
    >
      <Select
        className="w-100"
        style={{ width: "200px" }}
        mode="multiple" // multiple, tags
        maxCount={maxCount}
        suffixIcon={suffixIcon ? <BsThreeDots /> : null}
        allowClear
        placeholder={placeholder || "Select one or many options"}
        value={value}
        onChange={(val) => onChange && onChange(val)}
        options={options}
        filterOption={filterOption}
      />
    </Space>
  );
}

export default SelectMulti

// examples
// const option1 = []
// for (let i = 10 i < 36 i++) {
//   option1.push({
//     label: i.toString(36) + i,
//     value: i.toString(36) + i,
//   })
// }
// const option2 = [
//   {
//     label: <span>Brand</span>,
//     title: "Brand",
//     options: [
//       {
//         label: <span>Apple</span>,
//         value: "apple",
//       },
//       {
//         label: <span>Huawei</span>,
//         value: "huawei",
//       },
//     ],
//   },
//   {
//     label: <span>Customer Tier</span>,
//     title: "Customer Tier",
//     options: [
//       {
//         label: <span>Tier 1</span>,
//         value: "tier1",
//       },
//       {
//         label: <span>Tier 2</span>,
//         value: "tier2",
//       },
//     ],
//   },
// ]
// <SelectMulti
//   options={option1}
//   onChange={(value) => {}}
// />
// <SelectMulti
//   options={option2}
//   onChange={(value) => {}}
// />