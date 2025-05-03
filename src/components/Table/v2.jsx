import React, { useState, useEffect } from "react"
import { Table } from 'antd'
import _ from 'lodash'

import { thousandSeparatorFormatter } from "utils/thousandSeparator"

import './index.scss'

const ERPTable = props => {
  let {
    style,
    className,

    data,
    columns,
    summary,

    dataKey,
    selectedRow,
    onSelectRow,
    onRow,
    onChange,
    rowSelectionType,
    getCheckboxProps,
    rowClassName,
    rowKey,

    pageSize,
    totalRow,
    currentPage,
    pageSizeOptions,
    showSizeChanger,
    onChangePagination,
    showPagination,
    hideOnSinglePage,
    paginationPosition,
    customPaginationText,
    customPaginationPrev,
    customPaginationNext,
    customPaginationPage,
    customPaginationClassName,
    scroll
  } = props

  const [tablePageSize, updateTablePageSize] = useState(pageSize || 10)
  const [tableData, updateTableData] = useState([])
  const [sortField, updateSortField] = useState([])
  const [sortFieldOrder, updateSortFieldOrder] = useState([])

  useEffect(() => {
    updateTableData(addInRowKey(data))
    updateSortField([])
    updateSortFieldOrder([])
  }, [data])

  useEffect(() => {
    updateTablePageSize(pageSize || tablePageSize || 10)
  }, [pageSize])

  useEffect(() => {
    if (sortField.length > 0) {
      let tmp = _.cloneDeep(tableData)
      updateTableData(_.orderBy(tmp, sortField, sortFieldOrder))
    } else {
      updateTableData(addInRowKey(data))
    }
  }, [sortField, sortFieldOrder])

  const rowSelection = {
    type: rowSelectionType || 'checkbox',
    selectedRowKeys: selectedRow,
    onChange: onSelectRow,
    getCheckboxProps: getCheckboxProps
  };

  const addInRowKey = dataList => {
    if (dataKey) {
      let tmp = _.cloneDeep(dataList)
      _.map(tmp, val => val.key = val[dataKey])
      return tmp
    } else {
      return dataList
    }
  }

  const onSortData = param => {
    let tmpField = _.cloneDeep(sortField)
    let tmpFieldOrder = _.cloneDeep(sortFieldOrder)
    let tmpIndex = _.findIndex(tmpField, val => val === param.field)
    if (param.order) {
      if (tmpIndex > -1) {
        tmpFieldOrder[tmpIndex] = param.order === 'ascend' ? 'asc' : 'desc'
      } else {
        tmpField = [param.field]
        tmpFieldOrder = [param.order === 'ascend' ? 'asc' : 'desc']
      }
    } else {
      if (tmpIndex > -1) {
        tmpField.splice(tmpIndex, 1)
        tmpFieldOrder.splice(tmpIndex, 1)
      }
    }
    updateSortField(tmpField)
    updateSortFieldOrder(tmpFieldOrder)
  }

  const onTableChange = (pagination, filter, sorter, extra) => {
    if (!_.isUndefined(onChange)) {
      onChange(pagination, filter, sorter, extra)
    } else if (extra.action === 'sort') {
      onSortData(sorter)
    }
  }

  return (
    <Table
      style={style}
      className={`${hideOnSinglePage && ((totalRow || (tableData || []).length) / (tablePageSize || 10) <= 1) ? 'ERP-table hide-on-single-page ' : 'ERP-table '}${!_.isEmpty(summary) ? "summary-table " : ""}${className || ''}`}
      onRow={onRow}
      onChange={onTableChange}
      columns={columns}
      dataSource={tableData}
      rowSelection={!_.isUndefined(onSelectRow) && dataKey ? rowSelection : false}
      scroll={scroll}
      rowClassName={rowClassName}
      rowKey={rowKey}
      pagination={showPagination === false ? false : {
        total: totalRow,
        pageSize: tablePageSize,
        current: currentPage,
        onChange: (page, pageSize) => {
          updateTablePageSize(pageSize)
          onChangePagination(page, pageSize)
        },
        className: customPaginationClassName,
        position: paginationPosition || ["bottomCenter"],
        showTotal: customPaginationText,
        pageSizeOptions: pageSizeOptions || [10, 20, 50, 100],
        showSizeChanger: showSizeChanger || false,
        itemRender: (page, type, original) => {
          switch (type) {
            case "prev":
              return customPaginationPrev || original
            case "next":
              return customPaginationNext || original
            default:
              return customPaginationPage || original
          }
        }
      }}
      summary={pageData => {
        if (_.isEmpty(summary)) {
          return
        }
        return (
          <>
            <Table.Summary.Row style={{ backgroundColor: "#f3f4f7" }}>
              <Table.Summary.Cell index={0}>{summary.title}</Table.Summary.Cell>
              {
                columns.map((column, index) => {
                  if (index === 0) {
                    return <></>
                  }
                  return (
                    <Table.Summary.Cell index={index} align={column.align}>
                      {
                        column.summary
                          ? summary.render
                            ? summary.render((
                              thousandSeparatorFormatter(_.sumBy(pageData, val => {
                                const value = val[column.dataIndex]
                                return (value !== undefined && value !== null)
                                  ? (typeof value === "string" ? parseFloat(value) : value)
                                  : 0
                              }))
                            ), column.dataIndex)
                            : (
                              thousandSeparatorFormatter(_.sumBy(pageData, val => {
                                const value = val[column.dataIndex]
                                return (value !== undefined && value !== null)
                                  ? (typeof value === "string" ? parseFloat(value) : value)
                                  : 0
                              }), column.decimalPlaces || (summary.toFixed || 0))
                            )
                          : ""
                      }
                    </Table.Summary.Cell>
                  )
                })
              }
            </Table.Summary.Row>
          </>
        )
      }} />
  )
}

export default ERPTable


{/*
Documentation (Table)
  -style: [OBJ] style of table || optional || eg: { fontSize: "18px" }
  -className: [STR] className of table || optional || eg: "table"
  
  -data: [ARR] related data for the table  || eg: [{ id: 1, name: "ABC" }]
  -columns: [ARR] columns of table that is going to be display || eg: [{ title: 'ORG.ID', dataIndex: 'id', sorter: true}]
    -column settings: [OBJ]
      -title: [STR] title of the column || eg: "ORG.ID"
      -dataIndex: [STR] key to be refer to in the data || eg: "id"
      -sorter: [BOOL] enable the column to be sort by user || default to false || eg: true
      -render: [FUNC] render function allows custom display of the column cell || optional || eg: (_, record) => ( <a>{record.id}</a> )
      -summary: [BOOL] indicate the column that need to be total up in summary || optional || eg: true
    **column can include 'Table.SELECTION_COLUMN' as one of the array item to specify the column position of the checkbox. Need import { Table } from 'antd'
  -summary: [OBJ]
    -title: [STR] the row title || eg: "Total"
    -toFixed: [INT] the value of decimal place of the sum || eg: 2 will show value in 2decimal place, 0.00

  -dataKey: [STR] key to be refer to in the data for row selection || compulsory for row selection function || eg: "id"
  -selectedRow: [ARR] list of row selected || optional
  -onSelectRow: [FUNC] function to be done when a row is selected || param return included (selectedRowKeys, selectedRows) || compulsory for row selection function
  -rowSelectionType: [STR] row selection type (checkbox or radio)

  -totalRow: [INT] total number of rows of the data || compulsory || eg; 10
  -pageSize: [INT] specify the number of rows shown per page || default to 10 || eg: 15
  -currentPage: [INT] indicate which page currently is || compulsory || eg: 2
  -onChangePagination: [FUNC] function to handle pagination changes, update currentPage variable else pagination wont work || compulsory || param return included ( page, pageSize )
  -showPagination: [BOOL] show pagination bar || default to true || eg: true
  -hideOnSinglePage: [BOOL] hide page display when there is only one page  || default to false || eg: true
  -paginationPosition: [ARR] array that contains of pagination position. Can have one for top and one for bottom || default to ["bottomRight"] || eg: ["top", "bottom"]
  -customPaginationText: [FUNC] render function allows custom display of pagination text || optional || eg: ( total, range ) =>  `Showing ${range[0]}-${range[1]} of ${total} results`
  -customPaginationPrev: [FUNC] render function allows custom display of pagination prev button || optional
  -customPaginationNext: [FUNC] render function allows custom display of pagination next button || optional
  -customPaginationPage: [FUNC] render function allows custom display of pagination page display || optional
  -scroll: [OBJ] enable x or y scrollbar || optional || eg: scroll={{ x: "max-content", y: 300 }}
*/}