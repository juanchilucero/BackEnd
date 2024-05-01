import express from "express";
import productsController from "../controllers/productsController.js";

//creamos rutas para productos
const router = express.Router();


router.get("/", productsController.getAllProducts);
router.get("/:pid", productsController.getProductById);
router.post("/", productsController.addProduct);
router.put("/:pid", productsController.updateProduct);
router.delete("/:pid", productsController.deleteProduct);


export default router;
