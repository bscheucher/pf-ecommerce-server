import express from "express";
import {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/add", addReview);
router.get("/of-product/:productId", getReviews);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId/delete", deleteReview);

export default router;
