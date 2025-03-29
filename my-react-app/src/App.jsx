import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from '../components/Home.jsx'
import Login from '../components/Login.jsx'
import Navbar from '../components/Navbar.jsx'
import Signup from '../components/Signup.jsx'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
