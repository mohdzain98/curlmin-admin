import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import adminContext from "../context/adminContext";

const Login = (props) => {
  const { host, showAlert } = props.prop;
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [cred, setCred] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const context = useContext(adminContext);
  const { getUsers } = context;
  const [loader, setLoader] = useState("");

  useEffect(() => {
    if (localStorage.getItem("cmin_admintoken")) {
      navigate("/home");
    }
    // eslint-disable-next-line
  }, []);

  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoader("spinner-border spinner-border-sm mx-2");
    try {
      const response = await fetch(`${host}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cred.email, password: cred.password }),
      });
      if (response.status === 500) {
        showAlert("Internal Server Error Occurred", "danger");
      } else {
        const json = await response.json();
        if (json.success) {
          localStorage.setItem("cmin_admintoken", json.authToken);
          showAlert("Login Successfull", "success");
          navigate("/home");
          getUsers();
        } else {
          showAlert(json.errors, "danger");
        }
      }
    } catch (err) {
      showAlert(err, "danger");
    }
    setLoader("");
  };

  return (
    <div className="pt-5">
      <div
        className="container pt-4 d-flex justify-content-center align-items-center flex-column"
        id="login"
      >
        <h3 className="mb-4 fw-bold">Curlmin Admin Panel</h3>
        <div
          className="p-4 border rounded shadow-sm"
          style={isTabletOrMobile ? { width: "350px" } : { width: "500px" }}
        >
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                name="email"
                aria-describedby="emailHelp"
                value={cred.email}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                name="password"
                value={cred.password}
                onChange={onChange}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={cred.email === "" || cred.password === ""}
            >
              Submit
            </button>
            <span className={loader}></span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
