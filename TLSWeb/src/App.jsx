import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavButtons } from "./navigation.jsx";
import { Newsletter } from "./newslett.jsx";
import { Events } from "./event.jsx";
import { AboutUs } from "./aboutus.jsx";
import { Calendar } from "./calendar2.jsx";
import { Login } from "./login.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>

      {/* Left fixed navigation */}
      <NavButtons />

      {/* Main content wrapper */}
      <div className="page-content">

        {/* Watermark */}
        <img src="/TLS.jpg" alt="Watermark" className="watermark" />

        {/* Header section */}
        <div className="header">
          <img src="/TLS.jpg" alt="Logo" className="logo" />
          <h1>The Learning Sanctuary</h1>
        </div>

        {/* Routes / page content */}
        <Routes>
          <Route path="/newsletter/*" element={<Newsletter />} />
          <Route path="/events" element={<Events />} />
          <Route path="/" element={<AboutUs />} />
          <Route path="/calendar" element= {<Calendar />} />
          <Route path="/login" element= {<Login />} />
          {/* Add more routes here */}
        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;
