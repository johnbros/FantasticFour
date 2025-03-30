import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = (props) => {

    if (props.isLoggedIn) {
        return (
            <nav className="navbar">
                <Link to="/dashboard" className="nav-logo">
                    <img 
                        src="/duck_monical.png" 
                        alt="Duck Finance Logo" 
                        className="nav-logo-img"
                    />
                    Duck Finance
                </Link>
                <div className="nav-links">
                    <Link to='/contact'>Contact</Link>
                    {/* <Link to="/logout">Logout</Link> */}
                    <Link to="/profile">Profile</Link>
                    <Link to='/account'>Account</Link>
                </div>
                
            </nav>
        );
    } else {
        return (
            <nav className="navbar">
                <Link to="/" className="nav-logo">
                    <img 
                        src="/duck_monical.png" 
                        alt="Duck Finance Logo" 
                        className="nav-logo-img"
                    />
                    Duck Finance
                </Link>
                <div className="nav-links">
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </div>
            </nav>
        );
    }
};

export default Navbar;
