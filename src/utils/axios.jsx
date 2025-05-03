import Axios from "axios";
import _ from "lodash";
import getDomainURL from "utils/api";
import Cookies from "js-cookie";
import { storeItem, clearItem } from "utils/tokenStore";
import FileSaver from "file-saver";

import { setUserProfile } from "reducers/profile";

const whiteListAPI = [
  '/verify_registration',
  '/verify_reset_password',
]

const defaultMessage =
  "You are disconnnected from the internet, please reconnect to use ERP. If problem persists, please contact the system admin.";

export const Get = (url, response, error, load) => {
  load(true);
  const token = Cookies.get(window.location.href.includes("/admin-impersonate")
    ? "ERP_IMPERSONATE_ACCESS_TOKEN"
    : "ERP_ACCESS_TOKEN")
  const permissionToken = Cookies.get(window.location.href.includes("/admin-impersonate")
    ? "ERP_IMPERSONATE_PERMISSION_TOKEN"
    : "ERP_PERMISSION_TOKEN")
  Axios.defaults.headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${token}`,
  };
  Axios.defaults.responseType = "json";
  return Axios.get(`${getDomainURL()}${url}`)
    .then((res) => {
      if (permissionToken !== res.headers["x-permission-cache-key"] && !_.values(whiteListAPI).some(api => url.includes(api))) {
        if (Cookies.get("PERMISSION_ALERT") !== "true") {
          alert("Your session has expired, please login again.");
        }
        storeItem("PERMISSION_ALERT", "true")
        if (window.location.href.includes("/admin-impersonate")) {
          Promise.all([
            clearItem("ERP_IMPERSONATE_ACCESS_TOKEN"),
            clearItem("ERP_IMPERSONATE_PERMISSION_TOKEN"),
          ]).then(() => {
            window.close();
          });
        } else {
          Promise.all([
            clearItem("ERP_ACCESS_TOKEN"),
            clearItem("ERP_REFRESH_TOKEN"),
            clearItem("ERP_PERMISSION_TOKEN"),
            setUserProfile({})
          ]).then(() => {
            window.location.reload();
          });
        }
      }
      response(res.data);
      load(false);
    })
    .catch((err) => {
      if (err && err.response) {
        if (err.response.status === 401) {
          RefreshToken(() => Get(url, response, error, load), error)
        } else if (err.response.status === 500) {
          error(
            "Server encountered issues. Please contact your system admin for assistance."
          );
        } else {
          error(err.response.data.message);
        }
      } else if (err.response) {
        error(err.response.data.message);
      } else {
        error(defaultMessage);
      }
      load(false);
    });
};

export const Post = (url, data, response, error, load) => {
  load(true);
  let token = Cookies.get("ERP_ACCESS_TOKEN");
  Axios.defaults.headers = {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${token}`,
  };
  Axios.defaults.responseType = "json";
  return Axios.post(`${getDomainURL()}${url}`, data)
    .then((res) => {
      response(res.data);
      load(false);
    })
    .catch((err) => {
      if (err && err.response) {
        if (err.response.status === 401) {
          RefreshToken(() => Post(url, data, response, error, load), error)
        } else {
          error(err.response?.data ?? defaultMessage);
        }
      } else {
        error(defaultMessage);
      }
      load(false);
    });
};

export const Put = (url, data, response, error, load) => {
  load(true);
  let token = Cookies.get("ERP_ACCESS_TOKEN");
  Axios.defaults.headers = {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${token}`,
  };
  Axios.defaults.responseType = "json";
  return Axios.put(`${getDomainURL()}${url}`, data)
    .then((res) => {
      response(res.data);
      load(false);
    })
    .catch((err) => {
      console.dir(err, "err");
      if (err && err.response && err.response.status) {
        if (err.response.status === 401) {
          RefreshToken(() => Put(url, data, response, error, load), error)
        } else if (err.response.status === 500) {
          error(
            "Server encountered issues. Please contact your system admin for assistance."
          );
        } else if (err.response.status === 422 || err.response.data?.error_code === "ValidationError") {
          error(err.response?.data ?? defaultMessage);
        }
      } else if (err) {
        error(err.response.data[0]);
      } else {
        error(defaultMessage);
      }
      load(false);
    });
};

export const Delete = (url, response, error, load) => {
  load(true);
  let token = Cookies.get("ERP_ACCESS_TOKEN");
  Axios.defaults.headers = {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${token}`,
  };
  Axios.defaults.responseType = "json";
  return Axios.delete(`${getDomainURL()}${url}`)
    .then((res) => {
      response(res.data);
      load(false);
    })
    .catch((err) => {
      if (err && err.response && err.response.status) {
        if (err.response.status === 401) {
          RefreshToken(() => Delete(url, response, error, load), error)
        } else if (err.response.status === 500) {
          error(
            "Server encountered issues. Please contact your system admin for assistance."
          );
        } else {
          error(err.response?.data?.message ?? defaultMessage);
        }
      } else if (err) {
        error(err.response?.data?.message ?? defaultMessage);
      } else {
        error(defaultMessage);
      }
      load(false);
    });
};

// this is using POST
export const GetFile = async (url, savedFilename, response, error, load) => {
  load(true);
  let token = Cookies.get("ERP_ACCESS_TOKEN");
  Axios.defaults.headers = {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${token}`,
  };
  Axios.defaults.responseType = "blob";
  return Axios.post(`${getDomainURL()}${url}`)
    .then(async (res) => {
      load(false);
      if (res.status === 200) {
        const resultBlob = new Blob([res.data]);
        FileSaver.saveAs(resultBlob, savedFilename);
        response(resultBlob);
      }
    })
    .catch((err) => {
      if (err && err.response) {
        if (err.response.status === 401) {
          RefreshToken(() => GetFile(url, savedFilename, response, error, load), error)
        } else {
          error(err.response?.data ?? defaultMessage);
        }
      } else {
        error(defaultMessage);
      }
      load(false);
    });
};

// this is using POST
export const GetFileWithPayload = async (url, payload, savedFilename, response, error, load) => {
  load(true);
  let token = Cookies.get("ERP_ACCESS_TOKEN");
  Axios.defaults.headers = {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${token}`,
  };
  Axios.defaults.responseType = "blob";
  return Axios.post(`${getDomainURL()}${url}`, payload)
    .then(async (res) => {
      load(false);
      if (res.status === 200) {
        const resultBlob = new Blob([res.data]);
        FileSaver.saveAs(resultBlob, savedFilename);
        response(resultBlob);
      }
    })
    .catch((err) => {
      if (err && err.response) {
        if (err.response.status === 401) {
          RefreshToken(() => GetFile(url, savedFilename, response, error, load), error)
        } else {
          error(err.response?.data ?? defaultMessage);
        }
      } else {
        error(defaultMessage);
      }
      load(false);
    });
};


// this is using GET
export const GetDownloadFile = async (url, savedFilename, response, error, load) => {
  load(true);
  let token = Cookies.get("ERP_ACCESS_TOKEN");
  Axios.defaults.headers = {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${token}`,
  };
  Axios.defaults.responseType = "blob";
  return Axios.get(`${getDomainURL()}${url}`)
    .then(async (res) => {
      load(false);
      if (res.status === 200) {
        const resultBlob = new Blob([res.data]);
        FileSaver.saveAs(resultBlob, savedFilename);
        response(resultBlob);
      }
    })
    .catch((err) => {
      if (err && err.response) {
        if (err.response.status === 401) {
          RefreshToken(() => GetFile(url, savedFilename, response, error, load), error)
        } else {
          error(err.response?.data ?? defaultMessage);
        }
      } else {
        error(defaultMessage);
      }
      load(false);
    });
};

export const GetPreview = async (url, response, error, load) => {
  load(true);
  const token = Cookies.get("ERP_ACCESS_TOKEN");
  try {
    Axios.defaults.headers = {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    };
    Axios.defaults.responseType = "blob";
    const res = await Axios.get(`${getDomainURL()}/api/tokens/test`);
    if (res.status === 200) {
      let fileURL;
      if (url.includes("?")) {
        fileURL = `${getDomainURL()}${url}&token=${token}`;
      } else {
        fileURL = `${getDomainURL()}${url}?token=${token}`;
      }
      window.open(fileURL, '_blank');
    }
    load(false);
  } catch (err) {
    if (err && err.response) {
      if (err.response.status === 401) {
        RefreshToken(() => GetPreview(url, response, error, load), error)
      } else {
        error(err.response?.data ?? defaultMessage);
      }
    } else {
      error(defaultMessage);
    }
    load(false);
  }
}

export const RefreshToken = (response, error) => {
  const token = Cookies.get("ERP_REFRESH_TOKEN");
  Axios.defaults.headers = {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${token}`,
  };
  Axios.defaults.responseType = "json";
  return Axios.post(`${getDomainURL()}/api/tokens/refresh`, {})
    .then((res) => {
      storeItem("ERP_ACCESS_TOKEN", res.data.token);
      storeItem("ERP_REFRESH_TOKEN", res.data.refreshToken);
      response(res.data);
    })
    .catch((err) => {
      if (err && err.response) {
        if (err.response.status === 401) {
          clearItem("ERP_ACCESS_TOKEN");
          clearItem("ERP_REFRESH_TOKEN");
          window.location.reload();
          error(err.response.status);
        } else {
          error(err.response?.data ?? defaultMessage);
        }
      } else {
        error(defaultMessage);
      }
    });
}