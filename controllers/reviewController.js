import {
  createReview,
  getReviewsByProduct,
  getReviewsById,
  reviseReview,
  removeReview,
} from "../services/reviewService.js";

export const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized. Please log in to leave a review." });
  }

  if (!productId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      error:
        "Invalid input. Ensure productId and a rating between 1 and 5 are provided.",
    });
  }

  try {
    const review = await createReview({ userId, productId, rating, comment });
    return res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the review." });
  }
};

export const getReviews = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const reviews = await getReviewsByProduct(productId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error in getReviews controller:", error.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  // Optional validation for rating range
  if (rating !== undefined && (rating < 1 || rating > 5)) {
    return res.status(400).json({ error: "Rating must be between 1 and 5." });
  }

  try {
    const existingReview = await getReviewsById(reviewId);

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found." });
    }

    const updatedReview = await reviseReview(reviewId, { rating, comment });
    return res
      .status(200)
      .json({ message: "Review updated successfully.", review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const deletedReview = await removeReview(reviewId);
    res.status(200).json({
      message: "Review deleted successfully",
      review: deletedReview,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
