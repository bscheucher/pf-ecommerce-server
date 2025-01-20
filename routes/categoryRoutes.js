import express from "express";
import {
  addCategory,
  getCategory,
  listCategories,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/add", addCategory);
router.get("/", listCategories);
router.get("/:id", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id/delete", deleteCategory);

export default router;
