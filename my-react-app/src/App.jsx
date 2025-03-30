import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Navbar from './components/Navbar.jsx'
import Signup from './components/Signup.jsx'
import Dashboard from './components/Dashboard.jsx'
import About from './components/About.jsx'
import {ProtectedRoute,  UnprotectedRoute } from './components/protectedRoute.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'
import Profile from './components/profile.jsx'
import { useAuth } from '../src/context/authContext.jsx'
import Logout from './components/Logout.jsx'



function App() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Navbar isLoggedIn={isAuthenticated} />
      <div className="main-content">
        <Routes>

            <Route element={<UnprotectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
    </>
  )
}

export default App
