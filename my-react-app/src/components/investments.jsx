import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInvestment, addSubInvestment } from '../services/investmentServices';

function InvestmentDetails() {
  const { id } = useParams(); // Get investment ID from URL
  const navigate = useNavigate();
  
  // State
  const [investment, setInvestment] = useState(null);
  const [subInvestments, setSubInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch investment details and sub-investments
  const loadInvestmentData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch the main investment category
      const investmentData = await fetchInvestment(id);
      setInvestment(investmentData);
      
      // Assuming investmentData.subInvestments contains the array of sub-investments
      // If you need to make a separate API call to get sub-investments, do that here
      setSubInvestments(investmentData.subInvestments || []);
    } catch (err) {
      console.error("Failed to fetch investment details:", err);
      setError("Failed to load investment details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadInvestmentData();
  }, [loadInvestmentData]);

  // Handlers for adding/editing/deleting sub-investments
  const handleAddSubInvestment = async (newSubInvestment) => {
    setIsSaving(true);
    try {
      // Extract name and value from the form data
      const { name, value } = newSubInvestment;
      
      // Call the addSubInvestment API function with the investment ID and form data
      const addedSubInvestment = await addSubInvestment(id, name, parseFloat(value));
      
      // Update the state with the new sub-investment
      setSubInvestments(prev => [...prev, addedSubInvestment]);
      
      // Close the add form
      setIsAdding(false);
    } catch (err) {
      console.error("Failed to add sub-investment:", err);
      setError("Failed to add new investment item. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSubInvestment = async (subId, updatedData) => {
    setIsSaving(true);
    try {
      // Call your API to update a sub-investment
      // const updatedSubInvestment = await updateSubInvestmentAPI(subId, updatedData);
      
      // Update state
      // setSubInvestments(prev => prev.map(item => item._id === subId ? updatedSubInvestment : item));
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update sub-investment:", err);
      setError("Failed to update investment item. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubInvestment = async (subId) => {
    if (!window.confirm('Are you sure you want to delete this investment?')) {
      return;
    }
    
    setIsSaving(true);
    try {
      // Call your API to delete a sub-investment
      // await deleteSubInvestmentAPI(subId);
      
      // Update state
      // setSubInvestments(prev => prev.filter(item => item._id !== subId));
    } catch (err) {
      console.error("Failed to delete sub-investment:", err);
      setError("Failed to delete investment item. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Form for adding/editing sub-investments
  const SubInvestmentForm = ({ initialData = {}, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData);
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
    
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            name="name" 
            value={formData.name || ''} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Value:</label>
          <input 
            name="value" 
            type="number" 
            value={formData.value || ''} 
            onChange={handleChange} 
            required 
          />
        </div>
        {/* Add more fields as needed */}
        <div>
          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
        </div>
      </form>
    );
  };

  // Loading state
  if (isLoading) {
    return <div>Loading investment details...</div>;
  }

  // Error state
  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  // No investment found state
  if (!investment) {
    return <div>Investment not found</div>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        &larr; Back to Investments
      </button>
      
      <h1>{investment.investmentType || investment.category} Investments</h1>
      
      <div>
        <h3>Total Value: ${investment.value?.toFixed(2) || '0.00'}</h3>
      </div>
      
      {/* Add new sub-investment section */}
      {!isAdding && (
        <button 
          onClick={() => setIsAdding(true)} 
          disabled={isSaving || editingId}
        >
          Add New {investment.investmentType || investment.category} Investment
        </button>
      )}
      
      {isAdding && (
        <div>
          <h3>Add New Investment Item</h3>
          <SubInvestmentForm 
            onSubmit={handleAddSubInvestment}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}
      
      <hr />
      
      {/* List of sub-investments */}
      <h2>Your {investment.investmentType || investment.category} Investments</h2>
      
      {subInvestments.length === 0 ? (
        <p>You haven't added any specific investments to this category yet.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {subInvestments.map(subInv => (
            <li key={subInv._id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              padding: '15px',
              marginBottom: '10px' 
            }}>
              {editingId === subInv._id ? (
                <SubInvestmentForm 
                  initialData={subInv}
                  onSubmit={(data) => handleUpdateSubInvestment(subInv._id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div>
                  <h3>{subInv.name}</h3>
                  <p><strong>Value:</strong> ${subInv.value?.toFixed(2) || '0.00'}</p>
                  {/* Display other sub-investment details */}
                  
                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      onClick={() => setEditingId(subInv._id)} 
                      disabled={isSaving || editingId}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteSubInvestment(subInv._id)} 
                      disabled={isSaving || editingId}
                      style={{ color: 'red' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InvestmentDetails;