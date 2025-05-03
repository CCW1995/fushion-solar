import _ from "lodash"

export const orderTypeDefault = (query, sorter, onChange, queryName) => {
  const orderType = {
    ascend: "ASC",
    descend: "DESC",
  }

  let querySorter = _.cloneDeep(query.sorter)

  if (typeof sorter.field === "string") {
    if (sorter.order) {
      querySorter = { [sorter.field]: orderType[sorter.order] }
    } else {
      delete querySorter[sorter.field]
    }
  } 
  else if (Array.isArray(sorter.field)) {    
    if (!Array.isArray(querySorter)) {
      querySorter = []
      for (const key of Object.keys(query.sorter)) {
        querySorter.push([key, query.sorter[key]])
      }
    }

    if (sorter.order) {
      querySorter = [...sorter.field, orderType[sorter.order]]
    } else {
      querySorter = querySorter.filter((item) => !_.isEqual(item.slice(0, -1), sorter.field))
    }
  } 

  onChange(queryName, {
    ...query,
    sorter: querySorter,
  })
}