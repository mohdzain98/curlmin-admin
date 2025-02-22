import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import adminContext from "../../context/adminContext";
import Accordian from "./Accordian";

const Qrs = (props) => {
  const { host, showAlert } = props.prop;
  const [qrdata, setQrdata] = useState("");
  const [loading, setLoading] = useState(true);
  const context = useContext(adminContext);
  const { users, qrs } = context;
  const navigate = useNavigate();
  const model = "qrs";
  const name = "QR code";

  useEffect(() => {
    async function getData() {
      const result = await fetch(`${host}/core/getdata?serv=qrs`);
      const data = await result.json();
      setQrdata(data);
      setLoading(false);
    }
    if (!localStorage.getItem("cmin_admintoken")) {
      showAlert("Not allowed", "danger");
      navigate("/");
    } else {
      getData();
    }
    // eslint-disable-next-line
  }, [qrs]);

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <span className="spinner-border"></span>
      </div>
    );
  }
  const groupedQrs = qrdata.data.reduce((acc, url) => {
    if (!acc[url.userId]) {
      acc[url.userId] = [];
    }
    acc[url.userId].push(url);
    return acc;
  }, {});

  return (
    <div className="mt-4">
      <div className="container p-4 border">
        <h2 className="mt-2 mb-4">Curlmin QR codes</h2>
        <Accordian
          prop={{
            host,
            showAlert,
            groupedUrls: groupedQrs,
            users,
            model,
            name,
          }}
        />
      </div>
    </div>
  );
};

export default Qrs;
