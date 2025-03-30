import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Assuming the AuthContext is here
import './Account.css';

const Account = () => {
  const { logout, deleteAccount } = useAuth(); // Access logout and deleteAccount from context
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logging out
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsDeleting(true);
      setError(null);
      deleteAccount()
        .then(() => {
          navigate('/signup'); // Redirect to signup page after account deletion
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
          setError('Failed to delete account. Please try again.');
          setIsDeleting(false);
        });
    }
  };

  return (
    <div className="account-container">
      <div className="account-form">
        <h1 className="account-title">Account Settings</h1>
        <p className="account-description">Manage your account preferences and actions</p>
        
        {error && <div className="error-message">{error}</div>}
        
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
    </div>
  );
};

export default Account;
