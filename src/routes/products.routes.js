import express from "express";
import productsController from "../dao/controllers/productsController.js";
import { isLogin } from "../middlewares/isLogin.middleware.js";

const router = express.Router();

router.get("/", isLogin, productsController.getProducts);
router.get("/:pid", productsController.getProductById);
router.post("/", productsController.addProduct);
router.put("/:pid", productsController.updateProduct);
router.delete("/:pid", productsController.deleteProduct);

export default router;
