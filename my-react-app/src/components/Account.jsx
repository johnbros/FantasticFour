import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Assuming the AuthContext is here
// import '../styles/Account.css';

const Account = () => {
  const { logout, deleteAccount } = useAuth(); // Access logout and deleteAccount from context
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logging out
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsDeleting(true);
      deleteAccount()
        .then(() => {
          navigate('/signup'); // Redirect to signup page after account deletion
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
          setIsDeleting(false);
        });
    }
  };

  return (
    <div className="account-container">
      <h1>Your Account</h1>
      <p>Manage your account settings below:</p>

      <div className="account-actions">
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
        <button
          className="delete-button"
          onClick={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
};

export default Account;
