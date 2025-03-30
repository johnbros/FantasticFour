import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from '../components/Home.jsx'
import Login from '../components/Login.jsx'
import Navbar from '../components/Navbar.jsx'
import Signup from '../components/Signup.jsx'
import Dashboard from '../components/Dashboard.jsx'
import About from '../components/About.jsx'
import ProtectedRoute from '../components/protectedRoute.jsx'

function App() {
  
  return (
    <>
      <Navbar />
      <Routes>

        {/* <Navbar isLoggedIn={isAuthenticated} /> */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        
        

        <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
