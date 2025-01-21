import express from "express";

import {
  addAddress,
  getUserAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.post("/add", addAddress);
router.get("/of-user/:userId", getUserAddresses);
router.get("/:id", getAddress);
router.put("/:id", updateAddress);
router.delete("/:addressId/delete", deleteAddress);

export default router;
