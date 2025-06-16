const initialState = {
  selectedSite: null,
};

export default function siteSelector(state = initialState, action) {
  switch (action.type) {
    case 'SET_SELECTED_SITE':
      return {
        ...state,
        selectedSite: action.payload,
      };
    default:
      return state;
  }
}

// Action creator
export const setSelectedSite = (site) => ({
  type: 'SET_SELECTED_SITE',
  payload: site,
}); 