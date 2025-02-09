import express from "express";
import {
  addCategory,
  getCategory,
  listCategories,
  updateCategory,
  deleteCategory,
  addCategoryToProduct,
  detachCategoryFromProduct,
  getProductCategories,
  getCategoryProducts,
} from "../controllers/categoryController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/add", authenticateToken, addCategory);
router.get("/", listCategories);
router.get("/:id", getCategory);
router.put("/:id", authenticateToken, updateCategory);
router.delete("/:id/delete", authenticateToken, deleteCategory);
router.post("/add-to-product", authenticateToken, addCategoryToProduct);
router.delete("/remove-from-product", authenticateToken, detachCategoryFromProduct);
router.get("/of-product/:productId", getProductCategories);
router.get("/:categoryId/products", getCategoryProducts);

export default router;
