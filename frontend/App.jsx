import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login setCurrentPage={setCurrentPage} />;
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <>
      <Header setCurrentPage={setCurrentPage} />
      {renderPage()}
    </>
  );
}

export default App;