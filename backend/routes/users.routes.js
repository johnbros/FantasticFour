import express from 'express';

import { checkAuth } from '../middleware/auth.middleware.js';
import { getUser } from '../controllers/users.controller.js';


const router = express.Router();

router.get('/:id', checkAuth, async (req, res) => {
    let { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        id = validation.checkId(id, "User Id");
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    try {
        const user = await getUser(id);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}
);