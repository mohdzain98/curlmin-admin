import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Alert from "./components/Alert";
import AdminState from "./context/AdminState";
import Login from "./components/Login";
import Home from "./components/Home";
import Users from "./components/Users";
import Urls from "./components/service/Urls";
import Qrs from "./components/service/Qrs";
import Bcs from "./components/service/Bcs";
import Cts from "./components/service/Cts";

function App() {
  const [alert, setAlert] = useState(null);
  const host = process.env.REACT_APP_HOST;

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 3500);
  };

  return (
    <>
      <Router>
        <AdminState prop={{ host, showAlert }}>
          <Navbar />
          <Alert alert={alert} />
          <Routes>
            <Route
              exact
              path="/"
              element={<Login prop={{ host, showAlert }} />}
            />
            <Route
              exact
              path="/home"
              element={<Home prop={{ host, showAlert }} />}
            ></Route>
            <Route
              exact
              path="/users"
              element={<Users prop={{ host, showAlert }} />}
            ></Route>
            <Route
              exact
              path="/urls"
              element={<Urls prop={{ host, showAlert }} />}
            ></Route>
            <Route
              exact
              path="/qrcodes"
              element={<Qrs prop={{ host, showAlert }} />}
            ></Route>
            <Route
              exact
              path="/barcodes"
              element={<Bcs prop={{ host, showAlert }} />}
            ></Route>
            <Route
              exact
              path="/curltags"
              element={<Cts prop={{ host, showAlert }} />}
            ></Route>
          </Routes>
        </AdminState>
      </Router>
    </>
  );
}

export default App;
