import * as Labels from "utils/labels"

export const ModuleNav = [
  {
    icon: "icon-user-square",
    label: "Dashboard",
    content: [
      {
        label: "Main",
        to: "#/dashboard/main",
        tabs: [
          Labels.PRINT_JOB_STATUSES_LABEL,
          Labels.APPROVAL_NOTIFICATIONS,
          Labels.QUICK_ACCESS,
        ]
      }
    ]
  }
]

export const ImpersonateModuleNav = structuredClone(ModuleNav)
  .filter(nav => !["Superadmin", "Dashboard"].includes(nav.label))
  .map(nav => {
    nav.content = nav.content?.map(content => {
      content.to = content.to?.replace("#/", "#/admin-impersonate/")
      return content
    })
    return nav
  })

export const AccountNav = [
  {
    icon: "icon-settings",
    label: "Settings",
    to: "#/"
  },
  {
    icon: "icon-log-out",
    label: "Logout",
  },
]
