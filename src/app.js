import express from "express";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import { connectMongoDb } from './config/mongoDb.config.js';

const app = express();
const PORT = 8080;

connectMongoDb();

app.use(express.json());

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

app.listen(PORT, () => {
console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
