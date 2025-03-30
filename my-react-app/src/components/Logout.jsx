import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/authContext.jsx'
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        setLoading(true);
        logout();
        setLoading(false);
        navigate('/');
    }, [logout, navigate]);

    if (loading) {
        return <div>Logging out...</div>;
    }
    return <div>Logged out</div>;
}

export default Logout;
