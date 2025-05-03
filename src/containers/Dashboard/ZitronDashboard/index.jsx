import React, { useEffect, useState } from 'react'
import _ from 'lodash'

import Search from "components/Search"
import ERPCard from "components/Card"
import ERPIcon from "components/Icon"
import ERPButton from "components/Button"
import PageTitle from "components/Title/PageTitle";
import ERPCardHeader from "components/Card/header"
import LoadingOverlay from "components/Indicator/LoadingOverlay"
import { ModuleNav, ImpersonateModuleNav } from "components/Menu/VerticalNavWrapper/dataMainNav"

import { storeItem } from "utils/tokenStore"
import WithHOC from "./actions"

import "./index.scss"

const ERPDashboard = (props) => {
  const [accessibleLinks, setAccessibleLinks] = useState([])
  const [linksToDisplay, setLinksToDisplay] = useState([])
  const [searchFilter, setSearchFilter] = useState([
    {
      type: "text",
      placeholder: "Search...",
      customize: true,
      value: "text",
      param: "",
      classname: "dashboard-searchbar-input"
    },
  ])

  useEffect(() => {
    props.setPath([])
    props.getFavouriteModule()
  }, [])

  useEffect(() => {
    const links = []
    const navigationMenu = window.location.href.includes("/admin-impersonate")
      ? ImpersonateModuleNav
      : ModuleNav;

    //get accessible modules
    const userProfile = window.location.href.includes("/admin-impersonate")
      ? props.data.ImpersonateProfileReducer
      : props.data.ProfileReducer
    const userModules = userProfile.module;
    const accessibleModules = userProfile.profile?.user?.job_position?.uuid === "super admin"
      ? userModules
      : userModules.filter(module => module.is_accessible)
    const accessibleModuleNames = accessibleModules.map(module => module.name)
    //format links
    for (const menuItem of navigationMenu) {
      if (!accessibleModuleNames.includes(menuItem.label)) {
        continue
      }

      if (_.isEmpty(menuItem.content)) {
        continue
      }

      links.push({
        paths: ["Home Menu"],
        to: menuItem.content?.[0]?.to?.replace("#/", "/"),
        label: menuItem.label,
        module: null,
        module_id: accessibleModules.find(module => module.name === menuItem.label)?.id
      })

      for (const content of menuItem.content) {
        const parent_id = _.find(accessibleModules, { name: menuItem.label })?.id

        if (!accessibleModuleNames.includes(content.label)) {
          continue
        }

        const to = content.to?.replace("#/", "/")
        if (_.isEmpty(content.tabs)) {
          if (to) {
            links.push({
              paths: [menuItem.label],
              to: to,
              label: content.label,
              module: content.module,
              module_id: parent_id
                ? _.find(accessibleModules, { name: menuItem.label, parent_module_id: parent_id })?.id
                : _.find(accessibleModules, { name: menuItem.label }).id
            })
          }
        } else {
          const content_id = parent_id
            ? _.find(accessibleModules, { name: content.label, parent_module_id: parent_id })?.id
            : _.find(accessibleModules, { name: content.label }).id

          for (const tab of content.tabs) {
            if (!accessibleModuleNames.includes(tab)) {
              continue
            }

            links.push({
              paths: [menuItem.label, content.label],
              to: to,
              label: tab,
              module: tab,
              module_id: _.find(accessibleModules, { name: tab, parent_module_id: content_id })
                ? _.find(accessibleModules, { name: tab, parent_module_id: content_id }).id
                : _.find(accessibleModules, { name: tab }).id
            })
          }
        }
      }
    }
    setAccessibleLinks(_.sortBy(links, "label"))

  }, [props.data.profileReducer])

  useEffect(() => {
    const textQuery = searchFilter[0]?.param

    setLinksToDisplay(accessibleLinks.filter(link => (
      link.label.toLowerCase().includes(textQuery.toLowerCase())
    )))
  }, [accessibleLinks, searchFilter])

  return (
    <>
      <PageTitle
        heading={"Welcome to ERP"}
        appPageTitleClass={"dashboard-alignment m-0"}
      />
      <Search
        outerlayerClass={"dashboard-alignment"}
        containerClass={"dashboard-searchbar"}
        containerStyle={{ maxWidth: "500px", height: "35px" }}
        searchParams={searchFilter}
        onChangeSearchParams={val => setSearchFilter(val)}
        getTableData={() => { }}
        isJSONTableData
        hidePagination
      />

      {props.favouriteModule.length > 0 && (
        <div className="access-card-row">
          <PageTitle heading={"Favourite"} appPageTitleClass={'dashboar-favourite'} />
          {
            linksToDisplay.map(link => {
              if (props.favouriteModule.find(fav => fav.module_id === link.module_id)) {
                return (
                  <ERPCard
                    mode={"default"}
                    containerClass={"access-card-cont"}
                    containerStyle={{ height: "130px" }}>
                    <div
                      className='d-flex flex-column'
                      onClick={() => {
                        storeItem("LAST_VIEW_MODULE", link.module)
                        props.history.push(link.to);
                      }}>
                      <ERPCardHeader title={link.label} titleStyle={{ paddingRight: 40 }} />
                      <div className='text-light-grey ml-auto mt-auto' style={{ fontSize: "10px", textAlign: "right" }}>
                        {link.paths.join(" >> ")}
                      </div>
                    </div>
                    <ERPButton
                      color={"borderless"}
                      customClass={'access-not-favourite'}
                      onClick={() => props.deleteFavourite(props.favouriteModule.find(fav => fav.module_id === link.module_id).id)}>
                      <ERPIcon antIcon={"HeartFilled"} />
                    </ERPButton>
                  </ERPCard>
                )
              }
            })
          }
        </div>
      )}
      <div className="access-card-row">
        {
          linksToDisplay.map(link => {
            if (!props.favouriteModule.find(fav => fav.module_id === link.module_id)) {
              return (
                <ERPCard
                  mode={"default"}
                  containerClass={"access-card-cont"}
                  containerStyle={{ height: "130px" }}>
                  <div
                    className='d-flex flex-column'
                    onClick={() => {
                      storeItem("LAST_VIEW_MODULE", link.module)
                      props.history.push(link.to);
                    }}>
                    <ERPCardHeader title={link.label} titleStyle={{ paddingRight: 40 }} />
                    <div className='text-light-grey ml-auto mt-auto' style={{ fontSize: "10px", textAlign: "right" }}>
                      {link.paths.join(" >> ")}
                    </div>
                  </div>
                  <ERPButton
                    color={"borderless"}
                    customClass={'access-not-favourite'}
                    onClick={() => props.createFavourite(link.module_id)}>
                    <ERPIcon antIcon={"HeartOutlined"} />
                  </ERPButton>
                </ERPCard>
              )
            }
          })
        }
      </div>
      {props.onLoadFavourite && <LoadingOverlay />}
    </>
  )
}
export default WithHOC(ERPDashboard);