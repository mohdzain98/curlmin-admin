import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import adminContext from "../context/adminContext";
import "./Styling/users.css";

const Users = (props) => {
  const { showAlert } = props.prop;
  const [loading, setLoading] = useState(true);
  const context = useContext(adminContext);
  const { users, getUsers, formatDateTime } = context;
  const navigate = useNavigate();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  useEffect(() => {
    if (!localStorage.getItem("cmin_admintoken")) {
      showAlert("Not allowed", "danger");
      navigate("/");
    } else {
      setLoading(false);
    }
    getUsers(true);
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <span className="spinner-border"></span>
      </div>
    );
  }
  const defaultUser =
    users.dataCounts?.find((count) => count.userId === "default") || null;

  return (
    <div className="mt-4">
      <div className="container p-3">
        <h2 className="mt-2 mb-4">Curlmin Users</h2>
        <div className="table-responsive-xl">
          <table className="table  table-hover text-center align-middle">
            <caption>List of users</caption>
            <thead className="table-light">
              <tr>
                <th scope="col">Serial</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Creation Date</th>
                <th scope="col">Type</th>
                <th scope="col">Urls</th>
                <th scope="col">Qrs</th>
                <th scope="col">Barcodes</th>
                <th scope="col">Curltags</th>
                {/* <th scope="col">Action</th> */}
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {users.length > 0 &&
                users.data.map((item, index) => {
                  const userCount =
                    users.dataCounts?.find(
                      (count) => count.userId === item._id
                    ) || null;
                  return (
                    <tr key={item._id}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        {isTabletOrMobile ? (
                          <div class="short-container">{item.name}</div>
                        ) : (
                          item.name
                        )}
                      </td>
                      <td>
                        {isTabletOrMobile ? (
                          <div class="short-container">{item.email}</div>
                        ) : (
                          item.email
                        )}
                      </td>
                      <td>
                        {isTabletOrMobile ? (
                          <div class="short-container">
                            {formatDateTime(item.creationDate)}
                          </div>
                        ) : (
                          formatDateTime(item.creationDate)
                        )}
                      </td>
                      <td>{item.userType}</td>
                      <td>{userCount ? userCount.urlCount : 0}</td>
                      <td>{userCount ? userCount.qrCount : 0}</td>
                      <td>{userCount ? userCount.barcodeCount : 0}</td>
                      <td>{userCount ? userCount.curltagCount : 0}</td>
                      {/* <td>
                        <button className="btn btn-default btn-sm disabled">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td> */}
                    </tr>
                  );
                })}
              {defaultUser && (
                <tr>
                  <td>last</td>
                  <td>
                    <strong>Default</strong>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>{defaultUser.urlCount}</td>
                  <td>{defaultUser.qrCount}</td>
                  <td>{defaultUser.barcodeCount}</td>
                  <td>{defaultUser.curltagCount}</td>
                  {/* <td>
                    <button className="btn btn-default btn-sm" disabled>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td> */}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
