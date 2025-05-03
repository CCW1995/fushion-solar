import _ from "lodash"

export default function permissionsChecker(modulesName, data) {
  let tmp = {
    can_create: true,
    can_view: true,
    can_update: true,
    can_delete: true,
  }

  const tmpProfileReducer = window.location.href.includes("/admin-impersonate")
    ? data.ImpersonateProfileReducer
    : data.ProfileReducer

  tmp = _.find(tmpProfileReducer.module, {
    name: modulesName,
  })

  return (
    tmp || {
      can_create: false,
      can_view: false,
      can_update: false,
      can_delete: false,
    }
  )
}