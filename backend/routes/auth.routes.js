import express from 'express';
import userDataFunctions from '../data/users.js';
import { checkAuth } from '../middleware/auth.middleware.js';
import validation from '../validation.js';

const router = express.Router();


router.post('/', async (req, res) => {

    let { firstName, lastName, email, password } = req.body;

    try {
        firstName = validation.checkName(firstName, "firstName");
        lastName = validation.checkName(lastName, "lastName");
        email = validation.checkEmail(email, "email");
        password = validation.checkPassword(password);
        await validation.checkForDuplicateEmail(email);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    try {
        const newUser = await userDataFunctions.signUpUser(firstName, lastName, email, password);
        res.status(201).json(newUser);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    try {
        email = validation.checkEmail(email, "email");
        password = validation.checkPassword(password);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    try {
        
        const user = await userDataFunctions.loginUser(email, password);
        res.status(200).json(user);
        
    } catch (error) {
        if( error.message === "Either the username or password is invalid") {
            return res.status(401).json({ error: error.message });
        }
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});



router.delete('/delete/:id', checkAuth, async (req, res) => {
    let { id } = req.params;

    try {
        id = validation.checkId(id, "User Id");
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    let requestingUser = null;
    try {
        
        requestingUser = req.userData.userId
        if (requestingUser !== id) {
            return res.status(403).json({ error: 'Forbidden: You can only delete your own account' });
        }
        const user = await userDataFunctions.removeUser(id);
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;