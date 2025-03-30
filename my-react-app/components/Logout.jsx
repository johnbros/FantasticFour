import React from 'react'
import { useAuth } from '../src/context/authContext.jsx'
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { logout } = useAuth();

    logout();

    return <div>Logout</div>;

}




export default Logout;
