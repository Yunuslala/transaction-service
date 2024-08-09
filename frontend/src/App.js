// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import DashBoard from "./components/DashBoard";
import Transactions from "./components/Transaction";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
 

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/DashBoard" element={<DashBoard />} />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  );
};

export default App;
