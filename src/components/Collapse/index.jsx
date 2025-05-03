import React from "react"
import { Collapse } from "antd"
import { DownOutlined, UpOutlined } from "@ant-design/icons"

const CustomCollapse = ({
  accordion, //only one panel can be expanded at a time: true, false(default)
  children,
  collapsible, //specify the trigger area of collapsible: header, icon, disabled
  defaultActiveKey, //key of the initial active panel
  expandIconPosition, //set expand icon position: start(default), end
  ghost, //making collapse"s background to transparent
  size, //small, middle(default), large
  style,

  items,
}) => {
  const customExpandIcon = ({ isActive }) => {
    return isActive ? <UpOutlined /> : <DownOutlined />
  }

  return (
    <Collapse
      accordion={accordion}
      collapsible={collapsible || "header"}
      defaultActiveKey={defaultActiveKey}
      expandIcon={customExpandIcon}
      expandIconPosition={expandIconPosition || "end"}
      ghost={ghost || true}
      size={size}
      style={style}
    >
      {items.map(item => (
        <Collapse.Panel key={item.key} header={item.label} style={{ width: '100%' }}>
          {item.children || children}
        </Collapse.Panel>
      ))}
    </Collapse>
  )
}

export default CustomCollapse

// example
// const text = `
//   A dog is a type of domesticated animal.
//   Known for its loyalty and faithfulness,
//   it can be found as a welcome guest in many households across the world.
// `
// const items = [
//   {
//     key: "1",
//     label: "This is panel header 1",
//     children: <p>{text}</p>,
//   },
//   {
//     key: "2",
//     label: "This is panel header 2",
//     children: <p>{text}</p>,
//   },
//   {
//     key: "3",
//     label: "This is panel header 3",
//     children: <p>{text}</p>,
//   },
// ]
// <CustomCollapse items={items} defaultActiveKey={["1"]} />