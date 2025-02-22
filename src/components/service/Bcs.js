import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import adminContext from "../../context/adminContext";
import Accordian from "./Accordian";

const Qrs = (props) => {
  const { host, showAlert } = props.prop;
  const [bcdata, setBcdata] = useState("");
  const [loading, setLoading] = useState(true);
  const context = useContext(adminContext);
  const { users, bcs } = context;
  const navigate = useNavigate();
  const model = "bcs";
  const name = "Barcode";

  useEffect(() => {
    async function getData() {
      const result = await fetch(`${host}/core/getdata?serv=bcs`);
      const data = await result.json();
      setBcdata(data);
      setLoading(false);
    }
    if (!localStorage.getItem("cmin_admintoken")) {
      showAlert("Not allowed", "danger");
      navigate("/");
    } else {
      getData();
    }
    // eslint-disable-next-line
  }, [bcs]);

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <span className="spinner-border"></span>
      </div>
    );
  }
  const groupedBcs = bcdata.data.reduce((acc, url) => {
    if (!acc[url.userId]) {
      acc[url.userId] = [];
    }
    acc[url.userId].push(url);
    return acc;
  }, {});

  return (
    <div className="mt-4">
      <div className="container p-4 border">
        <h2 className="mt-2 mb-4">Curlmin Barcodes</h2>
        <Accordian
          prop={{
            host,
            showAlert,
            groupedUrls: groupedBcs,
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
