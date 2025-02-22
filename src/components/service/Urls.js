import React, { useState, useEffect, useContext, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import adminContext from "../../context/adminContext";

const Urls = (props) => {
  const { host, showAlert } = props.prop;
  const [urldata, setUrldata] = useState("");
  const [loading, setLoading] = useState(true);
  const [deLoad, setDeload] = useState(false);
  const context = useContext(adminContext);
  const { users, formatDateTime, urls, getUrls } = context;
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const navigate = useNavigate();
  const [modelVal, setModalVal] = useState({ userId: "", uid: "" });
  const ref = useRef(null);

  useEffect(() => {
    async function getData() {
      const result = await fetch(`${host}/core/getdata?serv=urls`);
      const data = await result.json();
      setUrldata(data);
      setLoading(false);
    }
    if (!localStorage.getItem("cmin_admintoken")) {
      showAlert("Not allowed", "danger");
      navigate("/");
    } else {
      getData();
    }
    // eslint-disable-next-line
  }, [urls]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <span className="spinner-border"></span>
      </div>
    );
  }
  const groupedUrls = urldata.data.reduce((acc, url) => {
    if (!acc[url.userId]) {
      acc[url.userId] = [];
    }
    acc[url.userId].push(url);
    return acc;
  }, {});

  const handleDelete = async (model, userId, uid) => {
    setDeload(true);
    try {
      const response = await fetch(`${host}/core/delete/${model}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, userId }),
      });
      if (response.status === 500) {
        showAlert("internal server error, try again after some time", "danger");
      } else {
        const result = await response.json();
        if (result.success) {
          showAlert("Url deleted Sucessfully", "success");
          getUrls();
        } else {
          showAlert(result.msg, "info");
        }
      }
    } catch (error) {
      console.log(error);
      showAlert("Unable to access server", "danger");
    } finally {
      setDeload(false);
      ref.current.click();
    }
  };

  return (
    <div className="mt-4">
      <div className="container p-4 border">
        <h2 className="mt-2 mb-4">Curlmin Urls</h2>
        <div className="accordion accordion-flush" id="accordionFlushExample">
          {Object.keys(groupedUrls).map((userId, index) => {
            const user =
              users.data?.find((user) => user._id === userId) || null;
            const userName = user
              ? { email: user.email, name: user.name }
              : "Unknown User";
            return (
              <div className="accordion-item" key={userId}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`} // Unique ID
                  >
                    {userName.name ? userName.name : "default"},{" "}
                    {userName.email} ({groupedUrls[userId].length} URLs)
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#userUrlsAccordion"
                >
                  <div className="accordion-body p-4">
                    <div className="table-responsive-xl">
                      <table className="table table-hover text-center align-middle">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Long URL</th>
                            <th>Creation Date</th>
                            <th>Expiry Date</th>
                            <th>UID</th>
                            <th>Pass</th>
                            <th>isPermanent</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedUrls[userId].map((url, i) => (
                            <tr key={url.uid}>
                              <td>{i + 1}</td>
                              <td>
                                {isTabletOrMobile ? (
                                  <div class="short-container">
                                    {url.longUrl}
                                  </div>
                                ) : (
                                  url.longUrl
                                )}
                              </td>
                              <td>
                                {isTabletOrMobile ? (
                                  <div class="short-container">
                                    {formatDateTime(url.creationDate)}
                                  </div>
                                ) : (
                                  formatDateTime(url.creationDate)
                                )}
                              </td>
                              <td>
                                {isTabletOrMobile ? (
                                  <div class="short-container">
                                    {formatDateTime(url.expiryDate)}
                                  </div>
                                ) : (
                                  formatDateTime(url.expiryDate)
                                )}
                              </td>
                              <td>{url.uid}</td>
                              <td>{url.pass ? "yes" : "no"}</td>
                              <td>{url.isPermanent ? "yes" : "no"}</td>
                              <td>
                                <button
                                  className="btn btn-default btn-sm"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                  onClick={() => {
                                    setModalVal({
                                      userId: userId,
                                      uid: url.uid,
                                    });
                                  }}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          class="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-body">{`Are you sure you want to delete ${modelVal.uid}`}</div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  data-bs-dismiss="modal"
                  ref={ref}
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  onClick={() =>
                    handleDelete("urls", modelVal.userId, modelVal.uid)
                  }
                  disabled={deLoad}
                >
                  {deLoad ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Deleteing..
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Urls;
