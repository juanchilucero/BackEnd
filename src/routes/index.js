import { Router } from "express";
import productsRoutes from "./products.routes";
import cartsRoutes from "./carts.routes.js";
import sessionRoutes from "./session.routes.js";

const router = Router();

router.use("/products", productsRoutes);
router.use("/carts", cartsRoutes);
router.use("/session", sessionRoutes);

export default router;