// src/pages/EditInvestmentsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/authContext'; 
import {fetchUser, getId, fetchUserFinacials} from '../services/userServices'; 
import { fetchInvestment, createInvestment, deleteInvestment } from '../services/investmentServices';
import './profile.css'
import { useNavigate } from 'react-router-dom';

const fetchUserInvestments = async () => {
  let userId = await getId();
  let user = await fetchUser(userId)
    if (!user.userFinancialId) {
        window.location.href = '/setup-financial-plan';
        return [];
    }
  let finances = await fetchUserFinacials(user.userFinancialId)
  let investments = finances.investments || []; // Ensure it's an array
// Fetch full investment details for each investment ID
if (!investments || investments.length === 0) {
    return []; // Return empty array if no investments found
}
const fullInvestments = await Promise.all(investments.map(async (inv) => {
    const investmentDetails = await fetchInvestment(inv);
    return { ...inv, ...investmentDetails };
}));
    return fullInvestments;
};

const addInvestmentAPI = async (investmentData) => {
  console.log('Adding investment:', investmentData);
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...investmentData, _id: `newInv_${Date.now()}` };
};

const updateInvestmentAPI = async (id, investmentData) => {
  console.log(`Updating investment ${id}:`, investmentData);
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...investmentData, _id: id }; 
};

const deleteInvestmentAPI = async (id) => {
  console.log(`Deleting investment ${id}`);
  await deleteInvestment(id); 
  await new Promise(resolve => setTimeout(resolve, 300));
  return { deletedCount: 1 }; 
};
const InvestmentForm = ({ initialData = { category: '', totalValue: '' }, onSubmit, onCancel, isSaving }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericData = {
        ...formData,
        quantity: parseFloat(formData.quantity) || 0,
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
    }
    onSubmit(numericData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Add more input fields based on your investment structure */}
      <div>
        <label>Category:</label>
        <input name="category" value={formData.category} onChange={handleChange} required disabled={isSaving} />
      </div>
      <button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
      {onCancel && <button type="button" onClick={onCancel} disabled={isSaving}>Cancel</button>}
    </form>
  );
};


// --- Main Page Component ---
function Profile() {
  const { user } = useAuth(); // Get logged-in user info if needed for context
  const navigate = useNavigate();

  // State
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingInvestmentId, setEditingInvestmentId] = useState(null); // ID of investment being edited
  const [isAdding, setIsAdding] = useState(false); // Toggle for add form
  const [isSaving, setIsSaving] = useState(false); 

  const loadInvestments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUserInvestments();
      setInvestments(data || []); // Ensure it's an array
    } catch (err) {
      console.error("Failed to fetch investments:", err);
      setError("Failed to load investments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means run once on mount

  useEffect(() => {
    loadInvestments();
  }, [loadInvestments]);


  // --- Handlers ---

  const handleAddSubmit = async (newInvestmentData) => {
    setIsSaving(true);
    setError(null);
    try {
      const categoryName = newInvestmentData.category;
      const addedInvestment = await createInvestment(categoryName);
      const formattedInvestment = {
        _id: addedInvestment._id,
        category: addedInvestment.investmentType, 
        purchasePrice: addedInvestment.value || 0,
      };
      
      setInvestments(prev => [...prev, formattedInvestment]);
      setIsAdding(false); // Close add form
    } catch (err) {
      console.error("Failed to add investment:", err);
      setError("Failed to add investment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSubmit = async (updatedData) => {
    if (!editingInvestmentId) return;
    setIsSaving(true);
    setError(null);
    try {
        // Replace with actual API call
      const updatedInvestment = await updateInvestmentAPI(editingInvestmentId, updatedData);
      setInvestments(prev =>
        prev.map(inv => (inv._id === editingInvestmentId ? updatedInvestment : inv))
      );
      setEditingInvestmentId(null); // Exit edit mode
    } catch (err) {
      console.error("Failed to update investment:", err);
      setError("Failed to update investment. Please try again.");
       // Keep edit mode open on error? Optional.
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (idToDelete) => {
    if (!window.confirm('Are you sure you want to delete this investment?')) {
      return;
    }

    setIsSaving(true); 
    setError(null);
    try {
      await deleteInvestmentAPI(idToDelete);
      setInvestments(prev => prev.filter(inv => inv._id !== idToDelete)); // Remove from list
    } catch (err) {
      console.error("Failed to delete investment:", err);
      setError("Failed to delete investment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Rendering ---

  if (isLoading) {
    return <div>Loading investments...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Manage Your Investments</h2>

      {/* --- Add Investment Section --- */}
      {!isAdding && (
        <button onClick={() => setIsAdding(true)} disabled={isSaving}>Add New Investment Category</button>
      )}
      {isAdding && (
        <div>
          <h3>Add New Investment Category</h3>
          <InvestmentForm
            onSubmit={handleAddSubmit}
            onCancel={() => setIsAdding(false)}
            isSaving={isSaving}
          />
        </div>
      )}

      <hr />

      {/* --- Investments List --- */}
      <h3>Your Investments</h3>
      {investments.length === 0 ? (
        <p>You haven't added any investments yet.</p>
      ) : (
        <ul>
          {investments.map((inv) => (
            <li key={inv._id} style={{ borderBottom: '1px solid #eee', marginBottom: '10px', paddingBottom: '10px' }}>
              {editingInvestmentId === inv._id ? (
                // --- Edit Form ---
                <InvestmentForm
                  initialData={inv}
                  onSubmit={handleUpdateSubmit}
                  onCancel={() => setEditingInvestmentId(null)}
                  isSaving={isSaving}
                />
              ) : (
                // --- Display Data ---
                <div>
                  <p><strong>Category:</strong> {inv.investmentType || inv.category}</p>
                  <p><strong>Total Value:</strong> ${(inv.value || inv.purchasePrice || 0).toFixed(2)}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      onClick={() => navigate(`/investments/${inv._id}`)} 
                      disabled={isSaving}>
                      View Details
                    </button>
                    <button 
                      onClick={() => setEditingInvestmentId(inv._id)} 
                      disabled={isSaving || editingInvestmentId}>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(inv._id)} 
                      disabled={isSaving || editingInvestmentId} 
                      style={{ color: 'red' }}>
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

export default Profile;