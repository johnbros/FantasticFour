// still have no idea what's going on here. someone else do this page lmao
import React from 'react';

const About = () => {
  return (
    <div className="about-container p-8 text-center">
      <h1 className="text-3xl font-semibold mb-4">About This App</h1>
      <p className="mb-4">
        This is a Personal Financial Advisor app designed to help you plan your investments and monitor your financial health.
      </p>
      <p className="mb-4">
        Our goal is to provide a user-friendly platform where you can track your financial progress and make informed decisions.
      </p>
      <h2 className="text-xl font-semibold">Features:</h2>
      <ul className="list-disc ml-6 mt-2 text-left">
        <li>Investment Planner</li>
        <li>Risk Analysis</li>
        <li>Profile Strength Assessment (represented by a duck)</li>
      </ul>
      <p className="mt-4">Thank you for using our service!</p>
    </div>
  );
};

export default About;
