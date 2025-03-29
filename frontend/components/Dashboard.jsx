import React from "react";

export default function Dashboard({ setCurrentPage }) {
  return (
    <div className="dashboard-container">
      <h1>Your Financial Dashboard</h1>
      <p>This is where your financial health is visualized.</p>
      <button onClick={() => setCurrentPage("home")}>Logout</button>
    </div>
  );
}