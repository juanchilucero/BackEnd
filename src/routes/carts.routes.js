import express from "express";
import cartsController from "../controllers/cartsController.js";

const router = express.Router();

// Ruta para crear un nuevo carrito
router.post("/", cartsController.createCart);

// Ruta para obtener un carrito por su ID
router.get("/:cid", cartsController.getCartById);

// Ruta para agregar un producto al carrito
router.post("/:cid/product/:pid", cartsController.addProductToCart);

export default router;
