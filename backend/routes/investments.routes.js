import express from 'express';

import { checkAuth } from '../middleware/auth.middleware.js';
import investments from '../data/investments.js';


const router = express.Router();

router.get('/:id', checkAuth, async (req, res) => {
    let { id } = req.params;
    let loggedInUserId = req.userData._id;
    let investment = null;
    

    if (!id) {
        return res.status(400).json({ error: 'Investment ID is required' });
    }
    id = id.trim(); 
    loggedInUserId = loggedInUserId.trim();

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
        res.status(200).json(investment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }

    try {
        if(loggedInUserId !== investment.userId) {
            return res.status(403).json({ error: 'You are not authorized to access this Investment' });
        }
        res.status(200).json(investment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', checkAuth, async (req, res) => {
    let investmentType = req.body.investmentType;
    let loggedInUserId = req.userData._id;
    let investmentId = null;

    try {
        investmentId = await investments.addInvestment(loggedInUserId, investmentType);
        if (!investmentId) {
            return res.status(500).json({ error: 'Error inserting investment id' });
        }
        res.status(200).json(investmentsId);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}
);

export default router;

