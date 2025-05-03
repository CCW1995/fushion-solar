export default () => {
  // return "http://localhost:6500";

  if (window.location.host.indexOf("localhost") !== -1) {
    return "https://dch-staging-api.appbaystudio.com";
  }
  if (window.location.host.indexOf("staging") !== -1) {
    return "https://dch-staging-api.appbaystudio.com";
  }
  if (window.location.host.indexOf("uat") !== -1) {
    return "https://dch-staging-api.appbaystudio.com";
  }
  return "https://dch-staging-api.appbaystudio.com";
};
