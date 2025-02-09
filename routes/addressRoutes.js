import express from "express";

import {
  addAddress,
  getUserAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/add", authenticateToken, addAddress);
router.get("/of-user/:userId", authenticateToken, getUserAddresses);
router.get("/:id", authenticateToken, getAddress);
router.put("/:id", authenticateToken, updateAddress);
router.delete("/:addressId/delete", authenticateToken, deleteAddress);

export default router;
