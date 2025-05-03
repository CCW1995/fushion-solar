import React, { useState, useEffect } from "react"
import { Tree, ConfigProvider } from "antd"
import _ from "lodash"

import ERPIcon from "components/Icon"
import ERPCheckbox from "components/Input/checkbox"

import "./index.scss"

const ERPTree = props => {
  let {
    data,
    checkable,
    fieldNames = { title: "title", key: "key", children: "children" },
    blockNode,
    expandedKeys,
    checkedKeys,
    checkStrictly,
    selectedKeys,
    selectAllText,
    titleRender,
    onSelect,
    onExpand,
    onCheck,
    showLine,
  } = props
  const [treeData, updateTreeData] = useState([])

  useEffect(() => {
    updateTreeData(data)
  }, [data])

  const onHandleCheck = (val) => {
    let value = checkStrictly ? val.checked : val
    let tmpIndex = value.indexOf(0)
    if (tmpIndex > -1) {
      value.splice(tmpIndex, 1)
    }

    onCheck(value)
  }

  const recursiveCheck = (data) => {
    let selected = []
    data.forEach(item => {
      if (item[fieldNames.children]) {
        selected.push(item[fieldNames.key])
        selected = selected.concat(recursiveCheck(item[fieldNames.children]))
      } else {
        selected.push(item[fieldNames.key])
      }
    })
    return selected
  }

  const onToggleSelectAll = (checked) => {
    if (checked) {
      const selected = recursiveCheck(data)
      onCheck(selected)
    } else {
      onCheck([])
    }
  }

  const checkAllSelected = () => {
    if (checkedKeys.length === 0) {
      return false
    }

    let selected = []
    data.forEach(item => {
      if (item[fieldNames.children]) {
        selected.push(item[fieldNames.key])
        selected = selected.concat(recursiveCheck(item[fieldNames.children]))
      } else {
        selected.push(item[fieldNames.key])
      }
    })

    return _.isEqual(selected.sort(), checkedKeys.sort())
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00ada9",
        }
      }}>
      {selectAllText && (
        <ERPCheckbox
          label={selectAllText}
          checked={checkAllSelected()}
          formGroupStyle={{ padding: "0 0 0px 12px" }}
          onChangeData={(checked) => onToggleSelectAll(checked)}
        />
      )}
      <Tree
        className={`ERP-tree`}
        checkable={checkable}
        blockNode={blockNode == undefined ? true : blockNode}
        switcherIcon={<ERPIcon custom="chevron-down" />}
        fieldNames={fieldNames}
        checkedKeys={checkedKeys}
        checkStrictly={checkStrictly}
        expandedKeys={[0, ...expandedKeys]}
        selectedKeys={selectedKeys}
        treeData={treeData}
        onSelect={onSelect}
        onExpand={onExpand}
        onCheck={onHandleCheck}
        showLine={showLine}
        titleRender={titleRender} />
    </ConfigProvider>
  )
}

export default ERPTree

{/*
  -data: [ARR] array that contains data that is needed to be shown in the tree || compulsory
  -checkable: [BOOL] enable check box in the tree || eg: false
  -fieldNames: [OBJ] to set the pointer of data title, key and children || default to { title: "title", key: "key", children: "children" }
  -expandedKeys: [ARR] array of keys of type integer to show which parent branches is expanded || eg: []
  -checkedKeys: [ARR] array of keys of type integer to show which parent branches is checked on the checkbox || eg: []
  -selectedKeys: [ARR] array of keys of type integer to show which parent branches is selected || eg: []
  -selectAllText: [STR] text title for select all section || optional, not provided will hide this section || eg: "Select All"
  -onSelect: [FUNC] function called when a node is selected, usually use to update the state || optional
  -onExpand: [FUNC] function called when a node is expand, usually use to update the state || optional
  -onCheck: [FUNC] function called when a node is check, usually use to update the state || optional

  Example:
  <ERPTree
    checkable
    fieldNames={{ title: "name", key: "id", children: "submodules" }}
    data={modules}
    expandedKeys={expandedKeys}
    checkedKeys={checkedKeys}
    selectAllText="Select All Modules"
    onCheck={val => setCheckedKeys(val)}
    onExpand={val => setExpandedKeys(val)}
    onSelect={val => onSelectTreeNode(val)} />
*/}