import React from "react";

export default function Home({ setCurrentPage }) {
  return (
    <div className="home-container">
      <h1>Welcome to Personal Financial Advisor</h1>
      <p>Plan your investments and track your financial health.</p>
      <button onClick={() => setCurrentPage("login")}>Login</button>
    </div>
  );
}