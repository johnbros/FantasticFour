import express from "express";

import { checkAuth } from "../middleware/auth.middleware.js";
import userData from "../data/users.js";
import validation from "../validation.js";

const router = express.Router();

router.get("/me", checkAuth, async (req, res) => {
  try {
    const loggedInUserId = req.userData.userId;
    res.status(200).json(loggedInUserId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", checkAuth, async (req, res) => {
  let { id } = req.params;
  let loggedInUserId = req.userData.userId;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    id = validation.checkId(id, "User Id");
  } catch (error) {
    console.log(error);
    return res.status(600).json({ error: error.message });
  }
  try {
    if (loggedInUserId !== id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to access this user" });
    }
    const user = await userData.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/finacials", checkAuth, async (req, res) => {
  let { id } = req.params;
  const loggedInUserId = req.userData.userId;
  let userFinance = null;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    id = validation.checkId(id, "User Id");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  // try {
  //     userFinance = await userFinancials.getUserFinancialsById(id);
  //     if (!userFinance) {
  //         return res.status(404).json({ error: 'User financials not found' });
  //     }
  // } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ error: error.message });
  // }
  if (id !== loggedInUserId) {
      return res.status(403).json({ error: 'You are not authorized to access this users financials' });
  }
  try {
    userFinance = await users.getUserById(id);
    if (!userFinance) {
      return res.status(404).json({ error: "User financials not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(userFinance);
});

router.post("/:id/finacials", checkAuth, async (req, res) => {
  let { id } = req.params;
  const loggedInUserId = req.userData.userId;
  let userFinance = null;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    id = validation.checkId(id, "User Id");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  try {
    if (loggedInUserId !== id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to access this user" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  // try {
  //     userFinance = await userFinancials.addUserFinancials(id, req.body.riskTolerance, req.body.investmentAmount);
  //     if (!userFinance) {
  //         return res.status(404).json({ error: 'User financials not found' });
  //     }

  // } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ error: error.message });
  // }
  const updateUserFinancials = {
    riskTolerance: req.body.riskTolerance,
  };

  try {
    userFinance = await userData.updateUser(id, updateUserFinancials);
    if (!userFinance) {
      return res.status(404).json({ error: "User financials not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(userFinance);
});

export default router;
