
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from '../components/Home.jsx'
import Login from '../components/Login.jsx'

function App() {

  return (
    <div>
      <h1>Hello World</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
