import React, { useState, useContext, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import adminContext from "../../context/adminContext";

const Accordian = (props) => {
  const { host, showAlert, groupedUrls, users, model, name } = props.prop;
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [deLoad, setDeload] = useState(false);
  const context = useContext(adminContext);
  const { getQrs, getBcs, getCts } = context;
  const [modelVal, setModalVal] = useState({ userId: "", uid: "" });
  const ref = useRef(null);

  const handleDelete = async (userId, uid) => {
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
          if (model === "qrs") {
            getQrs();
          } else if (model === "bcs") {
            getBcs();
          } else {
            getCts();
          }
          showAlert(`${name} deleted Sucessfully`, "success");
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
    <>
      <div className="accordion accordion-flush" id="accordionFlushExample">
        {Object.keys(groupedUrls).map((userId, index) => {
          const user = users.data?.find((user) => user._id === userId) || null;
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
                  {userName.name ? userName.name : "default"}, {userName.email}{" "}
                  ({groupedUrls[userId].length} URLs)
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
                          <th>UID</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedUrls[userId].map((url, i) => (
                          <tr key={url.uid}>
                            <td>{i + 1}</td>
                            <td
                              className="text-truncate"
                              style={{ maxWidth: "100px" }}
                            >
                              {isTabletOrMobile ? (
                                <div class="short-container">{url.longUrl}</div>
                              ) : (
                                <p
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title={url.longUrl}
                                >
                                  {url.longUrl}
                                </p>
                              )}
                            </td>
                            <td>{url.uid}</td>
                            <td>
                              <button
                                className="btn btn-default btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => {
                                  setModalVal({ userId: userId, uid: url.uid });
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
                onClick={() => handleDelete(modelVal.userId, modelVal.uid)}
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
    </>
  );
};

export default Accordian;
