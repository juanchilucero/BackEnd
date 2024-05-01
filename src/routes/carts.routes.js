import express from "express";
import productsController from "../controllers/productsController.js";
import cartsController from "../controllers/cartsController.js";

const router = express.Router();

// Routes for products
router.get("/", productsController.getAllProducts);
router.get("/:pid", productsController.getProductById);
router.post("/", productsController.addProduct);
router.put("/:pid", productsController.updateProduct);
router.delete("/:pid", productsController.deleteProduct);

// Routes for carts
router.post("/", cartsController.createCart);
router.get("/:cid", cartsController.getCartById);
router.post("/:cid/product/:pid", cartsController.addProductToCart);

export default router;