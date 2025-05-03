import React, { useEffect, useState } from "react"
import _ from "lodash"
import { Form, Input } from "antd"

import ERPIcon from "components/Icon"
import LoadingOverlay from "components/Indicator/LoadingOverlay"
import ERPTableV2 from "components/Table/v2"
import SearchForm from "components/SearchForm"
import CustomPagination from "components/Pagination"
import CustomModal from "components/Modal"

import WithItems from "actions/items"
import { orderTypeDefault } from "utils/orderType"

const ItemsModal = props => {

  let typingTimer;
  const [selectedItem, setSelectedItem] = useState([])
  const [searchKeyWords, setSearchKeyWords] = useState('')

  const onChangeSearchKeywords = () => {
    let tmp = {
      filter: { status__not_in: ["deleted"], ..._.isEmpty(props.itemQuery) ? {} : props.itemQuery },
      sorter: props.query.sorter,
      page: 1,
      size: 10
    }
    if (searchKeyWords) {
      tmp.filter = {
        ...tmp.filter,
        __or: {
          uuid__contains: searchKeyWords,
          name__contains: searchKeyWords,
        }
      }
    } else {
      tmp = tmp
    }
    props.onChangeItemsHOC("query", tmp)
  }

  useEffect(() => {
    if (props.isOpen) {
      props.getItems({
        ...props.query,
        filter: {
          ...props.query.filter,
          ...props.orgID && { organisation_id: props.orgID }
        }
      })
    }
  }, [props.isOpen, props.query])

  useEffect(() => {
    props.getBrands()
    props.getGroup({ filter: { status__not_in: ["deleted"] }, sorter: { name: "ASC" }, need_pagination: false });
  }, [])

  useEffect(() => {
    if (props.isOpen && props.selectedItems) {
      setSelectedItem(props.selectedItems)
    }
  }, [props.isOpen, props.selectedItems])

  useEffect(() => {
    if (!props.isOpen) {
      setSelectedItem(null)
      props.onChangeItemsHOC("searchParams", [
        {
          label: "Item Brand",
          type: "dropdown",
          value: "item_group*brand_id__nested",
          param: "",
          options: props.brands?.map(itemBrand => ({
            label: itemBrand.name,
            value: itemBrand.id,
          })),
          isIntergerValue: true,
        },
        {
          label: "Item Group",
          type: "dropdown",
          value: "item_group_id__contains",
          param: "",
          options: props.itemsGroupData?.map(itemsGroup => ({
            label: itemsGroup.name,
            value: itemsGroup.id,
          })),
          isIntergerValue: true,
        },
        {
          label: "On Hand Qty.",
          type: "checkbox",
          value: "balance_qty",
          param: false
        }
      ])
      props.onChangeItemsHOC('query', {
        filter: { status__not_in: ["deleted"] },
        sorter: { name: "ASC" },
        page: 1,
        page_size: 10
      })
    }
  }, [props.isOpen])

  useEffect(() => {
    props.onChangeItemsHOC("searchParams", [
      {
        label: "Item Brand",
        type: "dropdown",
        value: "item_group*brand_id__nested",
        param: "",
        options: props.brands?.map(itemBrand => ({
          label: itemBrand.name,
          value: itemBrand.id,
        })),
        isIntergerValue: true,
      },
      {
        label: "Item Group",
        type: "dropdown",
        value: "item_group_id__contains",
        param: "",
        options: props.itemsGroupData?.map(itemsGroup => ({
          label: itemsGroup.name,
          value: itemsGroup.id,
        })),
        isIntergerValue: true,
      },
      {
        label: "On Hand Qty.",
        type: "checkbox",
        value: "balance_qty",
        param: false
      }
    ])
  }, [props.itemsGroupData, props.brands])

  return (
    <CustomModal
      title={
        <div>
          All Items
          <span className="font-weight-normal text-xs mx-3">
            {`Total ${props.selectedItems?.length} ${parseInt(props.selectedItems?.length) < 2 ? "Item" : "Items"} Selected`}
          </span>
        </div>
      }
      customBodyClass={"default px-0"}
      customModalClass={"items-modal"}
      width={1000}
      isOpen={props.isOpen}
      onClose={props.toggle}
      rightActionText={"Add"}
      leftActionText={"Cancel"}
      onClickLeftAction={() => props.toggle()}
      onClickRightAction={() => selectedItem
        ? props.onSelectRow(selectedItem)
        : {}
      }
    >
      <div className="px-3">
        <Form.Item className="mx-0 my-0">
          <Input
            className="modal-searchbar-wrapper"
            style={{ margin: "0px" }}
            size="middle"
            placeholder={"Item ID / Item Name"}
            value={searchKeyWords}
            prefix={<ERPIcon antIcon="SearchOutlined" />}
            onChange={(e) => setSearchKeyWords(e.target.value)}
            onKeyUp={() => {
              clearTimeout(typingTimer);
              typingTimer = setTimeout(
                () => onChangeSearchKeywords(),
                500
              );
            }}
            onKeyDown={() => clearTimeout(typingTimer)}
          />
        </Form.Item>
        <SearchForm
          onChangeSearchParams={(val) => props.onChangeItemsHOC("searchParams", val)}
          getTableData={(val) => {
            let tmp = {
              filter: { status__not_in: ["deleted"], ...!_.isEmpty(props.itemQuery) ? props.itemQuery : {} },
              sorter: props.query.sorter,
              page: 1,
              size: 10
            }
            if (val) {

              let tempFilter = {
                status__not_in: ["deleted"]
              }
              _.keys(val).map(key => {
                if (key !== 'balance_qty') {
                  return tempFilter[key] = val[key]
                } else {
                  if (val.balance_qty) {
                    tempFilter['item_stock*on_hand_quantity&gt__nested'] = 0
                    tempFilter['item_stock*organisation_id__nested'] = 1
                  }
                }
              })
              tmp.filter = tempFilter
            } else {
              let tempFilter = {
                status__not_in: ["deleted"]
              }
              tmp = tmp
              tmp.filter = tempFilter
            }
            props.onChangeItemsHOC("query", tmp)
          }}
          searchParams={props.searchParams}
          isJSONTableData
        />
      </div>
      <ERPTableV2
        showFilter={true}
        data={props.itemsData}
        dataKey="id"
        rowSelectionType="checkbox"
        selectedRow={selectedItem ? selectedItem.map(item => item.item_id) : null}
        onSelectRow={(selectedRowKeys, selectedRows) => {
          setSelectedItem(selectedRows)
        }}
        pageSize={props.itemsMeta?.pageSize || 10}
        hideOnSinglePage={true}
        paginationPosition={["top"]}
        customPaginationText={() =>
          <div className="px-3">
            {`Showing ${props.itemsMeta?.from}-${props.itemsMeta?.to} of ${props.itemsMeta?.totalCount} results`}
          </div>
        }
        onChange={(pagination, filter, sorter, extra) => {
          if (extra.action === "sort") {
            orderTypeDefault(props.query, sorter, props.onChangeItemsHOC, "query")
          }
        }}
        columns={[
          {
            title: "ITEM ID",
            dataIndex: "uuid",
            sorter: false,
          },
          {
            title: "ITEM NAME",
            dataIndex: "name",
            sorter: false,
          },
          {
            title: "ITEM BRAND",
            dataIndex: ["item_group", "brand", "name"],
            sorter: false
          },
          {
            title: "ITEM GROUP",
            dataIndex: ["item_group", "name"],
            sorter: false,
          },
          {
            title: "ON HAND QTY.",
            sorter: false,
            align: "center",
            render: (_, record) => {
              const totalOnHandQty = record.item_stocks.reduce((sum, stock) => sum + stock.on_hand_quantity, 0)
              return totalOnHandQty
            }
          },
        ]}
        getCheckboxProps={(record) => ({
          ...props.disableSelection ? { disabled: props.disableSelection(record) } : {}
        })}
        rowClassName={(record) => {
          if (props.disableSelection) {
            return props.disableSelection(record) ? 'disabled-row' : ''
          } else {
            return ''
          }
        }}
      />
      <CustomPagination
        customContainerStyle={{ borderRadius: "0px" }}
        metadata={props.itemsMeta}
        onChangePage={(val) => props.onChangeItemsHOC("query", {
          ...props.query,
          page: val
        })}
      />

      {props.onLoadItems && <LoadingOverlay />}
    </CustomModal>
  );
};

export default WithItems(ItemsModal)