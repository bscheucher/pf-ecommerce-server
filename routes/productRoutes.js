import express from "express";
import {
  addProduct,
  getProduct,
  listProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/add", addProduct);
router.get("/:id", getProduct);
router.get("/", listProducts);
router.put("/:id", updateProduct);
router.delete("/:id/delete", deleteProduct);

export default router;
