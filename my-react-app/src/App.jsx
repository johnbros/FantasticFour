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
import InvestmentPreferencesPage from './components/InvestmentPreferencesPage.jsx'
import Profile from './components/profile.jsx'
import { useAuth } from '../src/context/authContext.jsx'
import Logout from './components/Logout.jsx'
import Contact from './components/Contact.jsx'
import Account from './components/Account.jsx'



function App() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Navbar isLoggedIn={isAuthenticated} />
      <div className="main-content">
        <Routes>

            {/*non protected protected routes*/}
            <Route element={<UnprotectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
            </Route>

            {/*non protected routes*/}
            <Route path='/contact' element={<Contact />} />

            {/*protected routes*/}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/setup-financial-plan" element={<InvestmentPreferencesPage />} />
                <Route path='/account' element={<Account />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
    </>
  )
}

export default App
