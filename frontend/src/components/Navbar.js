import React from "react";

const Navbar = ({ view, setView }) => {
  return (
    <nav className="navbar">
      <h1>🐾 Animal Rescue Request Board</h1>
      <div className="nav-buttons">
        <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
          View Requests
        </button>
        <button className={view === "form" ? "active" : ""} onClick={() => setView("form")}>
          Report an Animal
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
