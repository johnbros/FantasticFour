// src/pages/EditInvestmentsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/authContext'; 
import {fetchUser, getId, fetchUserFinacials} from '../services/userServices'; 
import { fetchInvestment, createInvestment } from '../services/investmentServices';

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
console.log(investments)
const fullInvestments = await Promise.all(investments.map(async (inv) => {
    const investmentDetails = await fetchInvestment(inv);
    return { ...inv, ...investmentDetails };
}));
    return fullInvestments;
};

const addInvestmentAPI = async (investmentData) => {
  console.log('Adding investment:', investmentData);
  // Example: const response = await apiClient.post('/api/investments', investmentData);
  // return response.data; // Should return the newly created investment with _id
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...investmentData, _id: `newInv_${Date.now()}` }; // Mock response
};

const updateInvestmentAPI = async (id, investmentData) => {
  console.log(`Updating investment ${id}:`, investmentData);
  // Example: const response = await apiClient.put(`/api/investments/${id}`, investmentData);
  // return response.data; // Should return the updated investment
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...investmentData, _id: id }; // Mock response
};

const deleteInvestmentAPI = async (id) => {
  console.log(`Deleting investment ${id}`);
  // Example: await apiClient.delete(`/api/investments/${id}`);
  // return { success: true };
  await new Promise(resolve => setTimeout(resolve, 300));
  return { deletedCount: 1 }; // Mock response (match backend/data layer)
};
// --- End Mock API Service Functions ---


// --- Simple Investment Form Component (Example) ---
// You might make this more sophisticated or reuse it
const InvestmentForm = ({ initialData = { category: '', totalValue: '' }, onSubmit, onCancel, isSaving }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic conversion for numbers before submitting
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

  // State
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingInvestmentId, setEditingInvestmentId] = useState(null); // ID of investment being edited
  const [isAdding, setIsAdding] = useState(false); // Toggle for add form
  const [isSaving, setIsSaving] = useState(false); // For disabling forms/buttons during API calls

  // Fetch investments on component mount
  const loadInvestments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace with your actual API call function
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
      // Extract just the category name and pass it to createInvestment
      const categoryName = newInvestmentData.category;
      const addedInvestment = await createInvestment(categoryName);
      const newInvestment = await fetchInvestment(addedInvestment._id); 
      setInvestments(prev => [...prev, newInvestment]); // Add to list
      setIsAdding(false); // Close add form
    } catch (err) {
      console.error("Failed to add investment:", err);
      setError("Failed to add investment. Please try again.");
      // Keep form open on error? Optional.
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
    // Simple confirmation (use a modal for better UX)
    if (!window.confirm('Are you sure you want to delete this investment?')) {
      return;
    }

    setIsSaving(true); // Use isSaving to indicate processing
    setError(null);
    try {
        // Replace with actual API call
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
                  <p><strong>Category:</strong> {inv.category}</p>
                  <p><strong>Total Value:</strong> ${inv.purchasePrice?.toFixed(2)}</p> {/* Example formatting */}
                  <button onClick={() => setEditingInvestmentId(inv._id)} disabled={isSaving || editingInvestmentId}>Edit</button>
                  <button onClick={() => handleDelete(inv._id)} disabled={isSaving || editingInvestmentId} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
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