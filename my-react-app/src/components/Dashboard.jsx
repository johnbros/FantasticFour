import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { getId, fetchUser, fetchUserFinacials } from '../services/userServices';
import { fetchInvestment } from '../services/investmentServices';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);

  // Pond and duck sizing parameters
  const pondWidth = 1200; // Estimated pond width in px
  const pondHeight = 800; // Estimated pond height in px
  const duckSize = 200;   // Approximate duck size in px
  const paddingFromEdge = 50; // Padding from edge in px
  
  useEffect(() => {
    const fetchUserInvestments = async () => {
      try {
        setLoading(true);
        let userId = await getId();
        let user = await fetchUser(userId);
        
        if (!user.userFinancialId) {
          setInvestments([]);
          setLoading(false);
          return;
        }
        
        let userFinancials = await fetchUserFinacials(user.userFinancialId);
        let investments = userFinancials.investments || [];
        
        if (investments.length === 0) {
          setInvestments([]);
          setLoading(false);
          return;
        }
        
        const fullInvestments = await Promise.all(investments.map(async (inv, index) => {
          const investment = await fetchInvestment(inv);
          
          // Calculate safe area for duck placement
          const maxX = pondWidth - duckSize - paddingFromEdge;
          const maxY = pondHeight - duckSize - paddingFromEdge;
          
          // Assign position within safe bounds of pond
          const position = {
            x: paddingFromEdge + Math.floor(Math.random() * (maxX - paddingFromEdge)),
            y: paddingFromEdge + Math.floor(Math.random() * (maxY - paddingFromEdge))
          };
          
          return {
            ...investment,
            _id: investment._id || inv._id || inv,
            position
          };
        }));
        
        setInvestments(fullInvestments);
        setLoading(false);
      } catch (e) {
        setError(e.message || 'Error fetching investments');
        console.error('Error fetching investments:', e);
        setLoading(false);
      }
    };
    
    fetchUserInvestments();
  }, []);

  const handleAddInvestment = () => {
    navigate('/profile');
  };

  const handleDuckClick = (investment) => {
    navigate(`/investments/${investment._id}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {error && <div className="error">{error}</div>}
      
      <div className="pond-container">
        {/* Display ducks on the pond */}
        {investments.map((investment) => (
          <div 
            key={investment._id} 
            className="duck-container"
            onClick={() => handleDuckClick(investment)}
            style={{
              position: 'absolute',
              top: `${investment.position.y}px`,
              left: `${investment.position.x}px`,
              zIndex: 10
            }}
          >
            <img
              src="/duck_water.png"
              alt="Duck"
              className="icon"
            />
            <div className="duck-popup">
              <p>{investment.investmentType}</p>
              <button onClick={(e) => {
                e.stopPropagation();
                navigate(`/investments/${investment._id}`);
              }}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {investments.length === 0 && (
        <div className="overlay">
          <div className="overlay-content">
            <h1>Add an Investment Category</h1>
            <button onClick={handleAddInvestment}>Add Investment</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

