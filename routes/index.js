import express from "express";
import userRoutes from "./userRoutes.js";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import orderRoutes from "./orderRoutes.js";
import addressRoutes from "./addressRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/addresses", addressRoutes);
router.use("/reviews", reviewRoutes);
router.use("/payments", paymentRoutes);

export default router;
