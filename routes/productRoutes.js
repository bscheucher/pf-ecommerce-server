import express from "express";
import {
  addProduct,
  getProduct,
  listProducts,
  updateProduct,
  deleteProduct,
  searchInProducts,
} from "../controllers/productController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/add", authenticateToken, addProduct);
router.get("/:id", getProduct);
router.get("/", listProducts);
router.put("/:id", authenticateToken, updateProduct);
router.delete("/:id/delete", authenticateToken, deleteProduct);
router.post("/search", searchInProducts);

export default router;
