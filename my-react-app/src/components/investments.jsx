import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInvestment, addSubInvestment, deleteSubInvestment, fetchSubInvestment } from '../services/investmentServices';

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

  // Simplified loadInvestmentData function
  const loadInvestmentData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch the main investment category
      const investmentData = await fetchInvestment(id);
      setInvestment(investmentData);
      
      // Simply use the subInvestments that are already in the investment data
      // No need to fetch each one individually 
      if (investmentData.subInvestments && Array.isArray(investmentData.subInvestments)) {
        const investments = investmentData.subInvestments.map(subInv => subInv._id);
        const fullInvestments = await Promise.all(investments.map(async (inv) => {
            const investmentDetails = await fetchSubInvestment(inv);
                return { ...inv, ...investmentDetails };}));
        setSubInvestments(fullInvestments);
        
      } else {
        setSubInvestments([]);
      }
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

  const handleDeleteSubInvestment = async (subId) => {
    if (!window.confirm('Are you sure you want to delete this investment?')) {
      return;
    }
    
    setIsSaving(true);
    try {
      // Call API to delete sub-investment
      await deleteSubInvestment(subId);
      
      // Update the state by removing the deleted item
      setSubInvestments(prev => prev.filter(item => item._id !== subId));
      
      // If this was the last sub-investment, refresh the main investment data
      if (subInvestments.length <= 1) {
        await loadInvestmentData();
      }
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