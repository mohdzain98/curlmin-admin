import React from "react";
import { Link } from "react-router-dom";

const Card = (props) => {
  const { id, title, head, item, href } = props.prop;
  return (
    <div className="card my-4 h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{head}</h6>
        <h1 className="card-text text-success">{item.length}</h1>
        {id === "count" && (
          <div className="d-flex flex-row gap-2 mt-2">
            <div className="p-2 rounded border" style={{ width: "100px" }}>
              <p style={{ marginBottom: "0px" }}>{`User's : ${Math.abs(
                item.data.totalCount - item.data.defaultCount
              )}`}</p>
            </div>
            <div className="p-2 rounded border" style={{ width: "100px" }}>
              <p
                style={{ marginBottom: "0px" }}
              >{`Default : ${item.data.defaultCount}`}</p>
            </div>
          </div>
        )}
        <div className="foot mt-auto">
          <Link to={`/${href}`} style={{ textDecoration: "none" }}>
            <button
              type="submit"
              className={`btn btn-outline-dark btn-sm`}
              style={{ float: "right", width: "60px" }}
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
