import express from "express";
import cartsController from "../controllers/cartsController.js";

const router = express.Router();


router.post("/", cartsController.createCart);


router.get("/:cid", cartsController.getCartById);


router.post("/:cid/product/:pid", cartsController.addProductToCart);

export default router;
