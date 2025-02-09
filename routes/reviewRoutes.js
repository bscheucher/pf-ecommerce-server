import express from "express";
import {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/add", authenticateToken, addReview);
router.get("/of-product/:productId", getReviews);
router.put("/:reviewId", authenticateToken, updateReview);
router.delete("/:reviewId/delete", authenticateToken, deleteReview);

export default router;
