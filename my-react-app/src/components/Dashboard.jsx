import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // for styling
import { useNavigate } from 'react-router-dom';
import {getId, fetchUser, fetchUserFinacials} from '../services/userServices';
import {fetchInvestment} from '../services/investmentServices';



const Dashboard = () => {
  const [loading, setLoading] = useState(true);


  const getRandomCoordinates = () => {

  }

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const fetchUserGenres= async () => {
      try {
        setLoading(true);
        let userId = await getId();
        let user = await fetchUser(userId);
        let userFinancials = await fetchUserFinacials(user.userFinancialId);
        let investments = userFinancials.investments;
        const fullInvestment = await Promise.all(investments.map(async (inv) => {
          const investment = await fetchInvestment(inv);
          return {...inv, ...investment}
        }));
        setInvestments(fullInvestment);
        setLoading(false);
      } catch (e) {
        setError(e);
        console.error('Error fetching user:', e);
      }

    }
    fetchUserGenres();
  }, []);


  const handleAddInvestment = () => {
    navigate('/profile');
  }



  const gridSize = 20;  
  const cellSize = 90; // px
  const [position, setPosition] = useState({ x: 0, y: 0 });


  const moveUp = (x, y) => {
    setPosition((prev) => {
      const newX = Math.max(0, Math.min(prev.x + x, gridSize - 1));
      const newY = Math.max(0, Math.min(prev.y + y, gridSize - 1));
      return { x: newX, y: newY };
    });
  };

  const moveDown = (x, y) => {
    setPosition((prev) => {
      const newX = Math.max(0, Math.min(prev.x + x, gridSize - 1));
      const newY = Math.max(0, Math.min(prev.y + y, gridSize - 1));
      return { x: newX, y: newY };
    });
  };

  const moveLeft = (x, y) => {
    setPosition((prev) => {
      const newX = Math.max(0, Math.min(prev.x + x, gridSize - 1));
      const newY = Math.max(0, Math.min(prev.y + y, gridSize - 1));
      return { x: newX, y: newY };
    });
  };

  const moveRight = (x, y) => {
    setPosition((prev) => {
      const newX = Math.max(0, Math.min(prev.x + x, gridSize - 1));
      const newY = Math.max(0, Math.min(prev.y + y, gridSize - 1));
      return { x: newX, y: newY };
    });
  };

  const [error, setError] = useState(null);

  const coordinates = [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: 1, y: 1},
    {x: 2, y: 0},
  ];


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {error && <div className="error">{error}</div>}
      <div className="side-tab">
        <h2>Duck Controls</h2>
        <div className="controls">
          <button onClick={() => moveUp(0, -1)}>↑</button>
          <button onClick={() => moveLeft(-1, 0)}>←</button>
          <button onClick={() => moveRight(1, 0)}>→</button>
          <button onClick={() => moveDown(0, 1)}>↓</button>
        </div>
      </div>
      
      {investments.map((investment) => (
        <div key={investment.id} className="map-container">
          <div className="grid">
            <div className="duck-container" onClick={() => alert(`Investment Details: ${investment.investmentType}`)}>
              <img
                src="/duck_water.png"
                alt="Duck"
                className="icon"
                style={{
                  top: position.y * cellSize,
                  left: position.x * cellSize,
                }}
              />
              <div className="duck-popup">
                <p>{investment.investmentType}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {investments.length === 0 && (
        <div className="overlay">
          <div className="overlay-content">
            <h1>Add an Investment Genre</h1>
            <button onClick={() => handleAddInvestment()}>Add Investment</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

