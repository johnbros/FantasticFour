import express from 'express';

import { checkAuth } from '../middleware/auth.middleware.js';
import investments from '../data/investments.js';
import validation from '../validation.js';
import userData from '../data/users.js';
import subInvestments from '../data/subInvestments.js';

const router = express.Router();

router.get('/:id', checkAuth, async (req, res) => {
    let { id } = req.params;
    // Use req.userData.userId if that's what your checkAuth provides
    const loggedInUserId = req.userData.userId; // Assuming checkAuth provides this

    // --- Input Validation ---
    if (!id) {
        return res.status(400).json({ error: 'Investment ID is required' });
    }
    try {
        // If validation modifies ID (like trimming), keep reassignment, otherwise const is fine
        id = validation.checkId(id, "Investment Id");
    } catch (error) {
        console.log("ID Validation Error:", error);
        return res.status(400).json({ error: error.message || 'Invalid Investment ID format' });
    }

    // --- Fetch, Authorize, and Respond ---
    try {
        // 1. Fetch Investment
        const investment = await investments.getInvestmentById(id);

        // 2. Check if Found
        if (!investment) {
            return res.status(404).json({ error: 'Investment not found' });
        }

        // 3. Authorize (Ensure investment object has a userId field!)
        //    Make sure the types are comparable (both strings)
        if (loggedInUserId.toString() !== investment.userId.toString()) {
            return res.status(403).json({ error: 'You are not authorized to access this Investment' });
        }

        // 4. Send SUCCESS Response (Only if found and authorized)
        res.status(200).json(investment);

    } catch (error) {
        // Handle errors from getInvestmentById or potential issues above
        console.log(`Error fetching/authorizing investment ${id}:`, error);
        // Check for specific data layer errors if possible, otherwise default to 500
        res.status(500).json({ error: error.message || 'Internal server error retrieving investment' });
    }
});

router.post('/', checkAuth, async (req, res) => {
    let investmentType = req.body.investmentCategory;
    let loggedInUserId = req.userData.userId;
    console.log(investmentType);
    let investmentId = null;
    let user = null;

    try {
        user = await userData.getUserById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        investmentId = await investments.addInvestment(loggedInUserId, user.userFinancialId, investmentType);
        if (!investmentId) {
            return res.status(500).json({ error: 'Error inserting investment id' });
        }
        res.status(200).json(investmentId);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}
);

router.delete('/:id', checkAuth, async (req, res) => {
    let { id } = req.params;
    const loggedInUserId = req.userData.userId;
    let investment = null;

    if (!id) {
        return res.status(400).json({ error: 'Investment ID is required' });
    }
    try {
        id = validation.checkId(id, "Investment Id");
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    try {
        investment = await investments.getInvestmentById(id);
        if (!investment) {
            return res.status(404).json({ error: 'Investment not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
    if (investment.userId !== loggedInUserId) {
        return res.status(403).json({ error: 'You are not authorized to access this Investment' });
    }
    try {
        await investments.removeInvestment(id);
        res.status(200).json({ deletedCount: 1 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}
);

router.post('/subInvestment/:investmentId', checkAuth, async (req, res) => {
    let { investmentId } = req.params;
    console.log(investmentId);
    let { name, value } = req.body;
    let subInvestment = null;

    if (!investmentId) {
        return res.status(400).json({ error: 'Investment ID is required' });
    }
    try {
        investmentId = validation.checkId(investmentId, "Investment Id");
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    try {
        subInvestment = await subInvestments.addSubInvestment(investmentId,name, value);
        if (!subInvestment) {
            return res.status(500).json({ error: 'Error inserting sub-investment id' });
        }
        res.status(200).json(subInvestment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}
);

export default router;

