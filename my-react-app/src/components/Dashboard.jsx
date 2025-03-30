import React, { useState } from 'react';
import './Dashboard.css'; // for styling

const Dashboard = () => {
  const gridSize = 40; // 10x10 grid
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

  return (
    <div className="dashboard-container">
      <div className="side-tab">
        <h2>Duck Controls</h2>
        <div className="controls">
          <button onClick={() => moveUp(0, -1)}>↑</button>
          <button onClick={() => moveLeft(-1, 0)}>←</button>
          <button onClick={() => moveRight(1, 0)}>→</button>
          <button onClick={() => moveDown(0, 1)}>↓</button>
        </div>
      </div>
      
      <div className="duck-display">
        <div className="map-container">
          <div className="grid">
            <img
              src="/duck_water.png"
              alt="Duck"
              className="icon"
              style={{
                top: position.y * cellSize,
                left: position.x * cellSize,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

