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

const router = express.Router();

router.post("/add", addCategory);
router.get("/", listCategories);
router.get("/:id", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id/delete", deleteCategory);
router.post("/add-to-product", addCategoryToProduct);
router.delete("/remove-from-product", detachCategoryFromProduct);
router.get("/of-product/:productId", getProductCategories);
router.get("/:categoryId/products", getCategoryProducts);

export default router;
