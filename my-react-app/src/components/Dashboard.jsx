//for now navigate to directly by adding to url with /dashboard
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Example Duck images for different tiers
import smallDuck from '../assets/small_duck.png';
import mediumDuck from '../assets/medium_duck.png';
import largeDuck from '../assets/large_duck.png';
import xlDuck from '../assets/xl_duck.png';
import giantDuck from '../assets/largest_duck.png';

const Dashboard = () => {
  const [profileStrength, setProfileStrength] = useState(1); // Set initial profile strength (1: weakest, 5: strongest)

  // Determine which duck to display based on profile strength
  const getDuckImage = () => {
    switch (profileStrength) {
      case 1: return smallDuck;
      case 2: return mediumDuck;
      case 3: return largeDuck;
      case 4: return xlDuck;
      case 5: return giantDuck;
      default: return smallDuck;
    }
  };

  const navigate = useNavigate();

  return (
    <div className="dashboard-container flex">
      {/* Left Tab for Investment Strategizer */}
      <div className="side-tab w-1/4 bg-gray-200 p-4">
        <h2 className="font-bold text-xl mb-4">Investment Strategizer</h2>
        <ul>
          <li className="mb-2 cursor-pointer" onClick={() => navigate('/investment-planner')}>Investment Planner</li>
          <li className="mb-2 cursor-pointer" onClick={() => navigate('/risk-analysis')}>Risk Analysis</li>
        </ul>
      </div>

      {/* Right Side - Duck Display */}
      <div className="duck-display w-3/4 p-8 text-center">
        <h1 className="text-3xl font-semibold mb-4">Your Financial Health</h1>
        <p className="mb-4">Your current profile strength is represented by the following duck:</p>
        <img
          src={getDuckImage()}
          alt={`Duck Tier ${profileStrength}`}
          className="duck-image mx-auto mb-4"
          style={{ width: '200px', height: 'auto' }}
        />
        <p className="font-semibold">Profile Strength: Tier {profileStrength}</p>
        {/* make sure to delete the div 'mt-6' once everything is working */}
        <div className="mt-6">
          <button onClick={() => setProfileStrength(Math.max(1, profileStrength - 1))} className="p-2 bg-blue-500 text-white rounded mr-4">
            Decrease Profile Strength
          </button>
          <button onClick={() => setProfileStrength(Math.min(5, profileStrength + 1))} className="p-2 bg-green-500 text-white rounded">
            Increase Profile Strength
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
