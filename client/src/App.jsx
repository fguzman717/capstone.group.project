import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import GetAll from "./components/GetAllItems.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
  const [items, setItems] = useState(null);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<GetAll />} />
        <Route path="/items" element={<GetAll />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
