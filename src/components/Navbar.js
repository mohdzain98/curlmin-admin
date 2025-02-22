import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("cmin_admintoken");
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container-fluid">
          <Link
            className="navbar-brand"
            to={location.pathname === "/" ? "/" : "/home"}
          >
            Admin Curlmin
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <Link
                  class="nav-link active"
                  aria-current="page"
                  to={location.pathname === "/" ? "/" : "/home"}
                >
                  Home
                </Link>
              </li>
              {location.pathname !== "/home" && location.pathname !== "/" && (
                <li className="nav-item dropdown me-2">
                  <a
                    className={`nav-link dropdown-toggle ${
                      location.pathname === "/urls" ||
                      location.pathname === "/qrcodes" ||
                      location.pathname === "/barcodes" ||
                      location.pathname === "/curltags"
                        ? "active"
                        : ""
                    }`}
                    href="/home"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Services
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      {location.pathname !== "/urls" && (
                        <Link className="dropdown-item" to="/urls">
                          Urls
                        </Link>
                      )}
                      {location.pathname !== "/qrcodes" && (
                        <Link className="dropdown-item" to="/qrcodes">
                          QR Code
                        </Link>
                      )}
                      {location.pathname !== "/barcodes" && (
                        <Link className="dropdown-item" to="/barcodes">
                          Barcode
                        </Link>
                      )}
                      {location.pathname !== "/curltags" && (
                        <Link className="dropdown-item" to="/curltags">
                          Curltag
                        </Link>
                      )}
                    </li>
                  </ul>
                </li>
              )}
            </ul>
            {!localStorage.getItem("cmin_admintoken") ? (
              ""
            ) : (
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-secondary dropdown-toggle mx-2 me-2"
                  data-bs-toggle="dropdown"
                  data-bs-display="static"
                  aria-expanded="false"
                >
                  <i
                    className="fa-solid fa-user me-2"
                    style={{ color: "#FFD43B" }}
                  ></i>
                  Admin
                </button>
                <ul className="dropdown-menu dropdown-menu-lg-end">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={handleLogout}
                      type="button"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
