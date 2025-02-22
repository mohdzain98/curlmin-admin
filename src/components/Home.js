import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminContext from "../context/adminContext";
import Card from "./Card";

const Home = (props) => {
  const { showAlert } = props.prop;
  const [loading, setLoading] = useState(true);
  const context = useContext(adminContext);
  const {
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
  } = context;
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("cmin_admintoken")) {
      showAlert("Not allowed", "danger");
      navigate("/");
    } else {
      setLoading(false);
    }
    getUsers(false);
    getUrls();
    getQrs();
    getBcs();
    getCts();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <span className="spinner-border"></span>
      </div>
    );
  }

  return (
    <div className="container py-5 px-3 mb-3">
      <div className="row gy-4">
        <div className="col-md-4 col-xs-6 ">
          <Card
            prop={{
              id: "",
              title: "Users",
              head: "All Users in the Database",
              item: users,
              href: "users",
            }}
          />
        </div>
        <div className="col-md-4  col-xs-6">
          <Card
            prop={{
              id: "count",
              title: "Urls",
              head: "All Urls in the Database",
              item: urls,
              href: "urls",
            }}
          />
        </div>
        <div className="col-md-4  col-xs-6">
          <Card
            prop={{
              id: "count",
              title: "QR codes",
              head: "All QRs in the Database",
              item: qrs,
              href: "qrcodes",
            }}
          />
        </div>
        <div className="col-md-4  col-xs-6">
          <Card
            prop={{
              id: "count",
              title: "Barcodes",
              head: "All Barcodes in the Database",
              item: bcs,
              href: "barcodes",
            }}
          />
        </div>
        <div className="col-md-4  col-xs-6">
          <Card
            prop={{
              id: "count",
              title: "Curltags",
              head: "All Curltags in the Database",
              item: cts,
              href: "curltags",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
