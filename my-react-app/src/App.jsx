
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from '../components/Home.jsx'

function App() {

  return (
    <div>
      <h1>Hello World</h1>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
