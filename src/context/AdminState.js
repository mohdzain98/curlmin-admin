import React from "react";
import { useState } from "react";
import adminContext from "./adminContext";

const AdminState = (props) => {
  const { host, showAlert } = props.prop;
  const [users, setUsers] = useState({ success: false, data: [], length: 0 });
  const [urls, setUrls] = useState({
    success: false,
    data: { totalCount: 0, defaultCount: 0 },
    length: 0,
  });
  const [qrs, setQrs] = useState({
    success: false,
    data: { totalCount: 0, defaultCount: 0 },
    length: 0,
  });
  const [bcs, setBcs] = useState({
    success: false,
    data: { totalCount: 0, defaultCount: 0 },
    length: 0,
  });
  const [cts, setCts] = useState({
    success: false,
    data: { totalCount: 0, defaultCount: 0 },
    length: 0,
  });

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`${host}/core/${endpoint}`, {
        method: "GET",
      });
      if (response.status === 500) {
        showAlert("server error occurred while fetching urls", "danger");
        return false;
      } else {
        const data = await response.json();
        if (data.success) {
          return data;
        } else {
          showAlert("Not Found", "info");
          return false;
        }
      }
    } catch (error) {
      showAlert("An error occurred while fetching data", "danger");
    }
  };

  const getUsers = async (flag) => {
    const response = await fetch(`${host}/core/getusers?flag=${flag}`, {
      method: "GET",
    });

    const data = await response.json();
    setUsers(data);
  };

  const getUrls = async () => {
    const data = await fetchData("geturls");
    if (data) {
      setUrls(data);
    }
  };

  const getQrs = async () => {
    const data = await fetchData("getqrs");
    if (data) {
      setQrs(data);
    }
  };

  const getBcs = async () => {
    const data = await fetchData("getbcs");
    if (data) {
      setBcs(data);
    }
  };

  const getCts = async () => {
    const data = await fetchData("getcts");
    if (data) {
      setCts(data);
    }
  };
  const formatDateTime = (dateTime) => {
    const givenDate = new Date(dateTime);

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      //   second: "2-digit",
      hour12: false,
      timeZone: "UTC", //prod
    };
    return givenDate.toLocaleString("en-US", options);
  };

  return (
    <div>
      <adminContext.Provider
        value={{
          users,
          getUsers,
          urls,
          getUrls,
          qrs,
          getQrs,
          bcs,
          getBcs,
          cts,
          getCts,
          formatDateTime,
        }}
      >
        {props.children}
      </adminContext.Provider>
    </div>
  );
};

export default AdminState;
