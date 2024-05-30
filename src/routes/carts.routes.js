import express from "express";
import cartsController from "../dao/controllers/cartsController.js";

const router = express.Router();

router.post("/", cartsController.createCart);
router.get("/:cid", cartsController.getCartById);
router.post("/:cid/products/:pid", cartsController.addProductToCart);
router.delete("/:cid/products/:pid", cartsController.removeProductFromCart); // Nuevo endpoint
router.put("/:cid", cartsController.updateCart); // Nuevo endpoint
router.put("/:cid/products/:pid", cartsController.updateProductQuantity); // Nuevo endpoint
router.delete("/:cid", cartsController.clearCart); // Nuevo endpoint

export default router;
