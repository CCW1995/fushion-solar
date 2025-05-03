import _ from "lodash"

export const tabPermission = (data, labels, addedLabels = new Set()) => {
  let tmp = []

  data.forEach(item => {
    if (item.is_accessible) {
      const tmpLabel = labels.find(label =>
        label.label === item.name
        && item.children.length === 0
      )
      if (tmpLabel && !addedLabels.has(tmpLabel.label)) {
        tmp.push({ label: tmpLabel.label, id: item.id })
        addedLabels.add(tmpLabel.label)
      }
      if (item.children && item.children.length > 0) {
        tmp = tmp.concat(tabPermission(item.children, labels, addedLabels))
      }
    }
  })

  const labelOrder = _.map(labels, "label")
  tmp = _.sortBy(tmp, item => _.indexOf(labelOrder, item.label))

  return tmp
}
