import { GET_PROFILE } from "../actions/type";
import _ from "lodash"

const initialState = {
  profile: {
    role_id: 1,
    email: "superadmin@bkp.com",
    first_name: "Super",
    last_name: "Admin",
    created_at: "2021-12-05T18:14:27.268853Z",
    updated_at: "2021-12-05T18:14:27.274905Z",
  },
  module: [],
  groupedModule: {},
  parentModule: {},
  subModule: [],
  organisations: [],
  branches: [],
};

function buildTree(groupedModule, moduleId) {
  return (groupedModule[moduleId] || []).map(module => ({
    ...module,
    children: buildTree(groupedModule, module.id)
  }));
}

export const setUserProfile = payload => ({
  type: GET_PROFILE,
  payload,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE: {
      const { data, permissions } = action.payload;
      return {
        ...state,
        profile: data,
        module: permissions?.modules,
        groupedModule:  _.groupBy(permissions?.modules.filter(module => module.is_accessible === true), "parent_module_id"),
        parentModule: _.keyBy(permissions?.modules.filter(module => module.parent_module_id === null), 'id'),
        subModule: buildTree( _.groupBy(permissions?.modules, "parent_module_id"), null),
        organisations: _.orderBy(permissions?.organisations, ['name'], ['asc']),
        branches: _.orderBy(_.flatMap(permissions?.organisations, ({ id: orgId, branches }) => _.map(branches, branch => ({ ...branch, orgId }))), ['name'], ['asc'])
      }
    }
    default:
      return state;
  }
};
