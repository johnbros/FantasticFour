import React from "react";

export default function Header({ setCurrentPage }) {
  return (
    <header className="header">
      <h1>Financial Advisor</h1>
      <nav>
        <button onClick={() => setCurrentPage("home")}>Home</button>
        <button onClick={() => setCurrentPage("login")}>Login</button>
        <button onClick={() => setCurrentPage("dashboard")}>Dashboard</button>
      </nav>
    </header>
  );
}