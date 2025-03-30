// src/pages/InvestmentPreferencesPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/authContext'; 
import { postFinancialPreferences, getId } from '../services/userServices';

// --- Mock API Service Functions (Replace with actual service calls) ---
// These should ideally live in src/services/preferenceService.js or userService.js
const fetchUserPreferences = async () => {
  console.log('Fetching preferences...');
  // Example: const response = await apiClient.get('/api/preferences'); // Or /api/users/me/preferences
  // return response.data;
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay
  // Return null if no preferences saved yet, or mock data:
  // return null;
  return { riskTolerance: 3, investmentAmount: 5000 }; // Example existing data
};

const saveUserPreferences = async (preferences) => {
  console.log('Saving preferences:', preferences);
  // Example: const response = await apiClient.put('/api/preferences', preferences); // Or POST/PATCH
  // return response.data;
  await new Promise(resolve => setTimeout(resolve, 600));
  return { success: true, data: preferences }; // Mock response
};
// --- End Mock API Service Functions ---


function InvestmentPreferencesPage() {
  const { user } = useAuth(); // Get user context if needed (e.g., to confirm login)

  // --- State ---
  const [riskTolerance, setRiskTolerance] = useState(''); // Use string for select value initially
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading initial data
  const [isSaving, setIsSaving] = useState(false);  // Saving data
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // --- Fetch existing preferences on mount ---
  const loadPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUserPreferences();
      if (data) {
        setRiskTolerance(data.riskTolerance.toString()); // Ensure string for select
        setInvestmentAmount(data.investmentAmount.toString()); // Ensure string for input
      } else {
        // Set defaults if no preferences found
        setRiskTolerance('3'); // Example default
        setInvestmentAmount('');
      }
    } catch (err) {
      console.error("Failed to fetch preferences:", err);
      setError("Could not load your current preferences. Please try again later.");
      // Set defaults even on error? Or show error prominently?
      setRiskTolerance('3');
      setInvestmentAmount('');
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means run once on mount

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // --- Handlers ---
  const handleRiskChange = (event) => {
    setRiskTolerance(event.target.value);
  };

  const handleAmountChange = (event) => {
    setInvestmentAmount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // --- Basic Client-Side Validation ---
    const riskNum = parseInt(riskTolerance, 10);
    const amountNum = parseFloat(investmentAmount);

    if (isNaN(riskNum) || riskNum < 1 || riskNum > 5) {
      setError("Please select a valid risk tolerance (1-5).");
      return;
    }
    if (isNaN(amountNum) || amountNum < 0) {
      setError("Please enter a valid positive number for the investment amount.");
      return;
    }
    // Add more validation as needed

    setIsSaving(true);
    try {
      const preferencesToSave = {
        riskTolerance: riskNum,
        investmentAmount: amountNum,
      };
      // --- Replace with actual API call ---
      const userId = await getId();
      await postFinancialPreferences(userId, preferencesToSave);
      setSuccessMessage("Preferences saved successfully!");

    } catch (err) {
      console.error("Failed to save preferences:", err);
      setError("Failed to save preferences. Please try again.");
      // Consider showing more specific errors based on API response if available
    } finally {
      setIsSaving(false);
    }
  };

  // --- Rendering ---
  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div>
      <h2>Setup Investment Preferences</h2>
      <p>Set your risk tolerance and desired annual investment amount.</p>

      {/* Display general error or success messages */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        {/* --- Risk Tolerance Input --- */}
        <div>
          <label htmlFor="riskTolerance">Risk Tolerance (1=Low, 5=High):</label>
          <select
            id="riskTolerance"
            value={riskTolerance}
            onChange={handleRiskChange}
            required
            disabled={isSaving}
          >
            <option value="" disabled>-- Select Level --</option>
            <option value="1">1 - Very Low</option>
            <option value="2">2 - Low</option>
            <option value="3">3 - Medium</option>
            <option value="4">4 - High</option>
            <option value="5">5 - Very High</option>
          </select>
        </div>

        <br />

        {/* --- Investment Amount Input --- */}
        <div>
          <label htmlFor="investmentAmount">Annual Investment Amount ($):</label>
          <input
            type="number"
            id="investmentAmount"
            value={investmentAmount}
            onChange={handleAmountChange}
            required
            min="0"
            step="100" // Example step
            placeholder="e.g., 5000"
            disabled={isSaving}
          />
        </div>

        <br />

        {/* --- Submit Button --- */}
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
}

export default InvestmentPreferencesPage;