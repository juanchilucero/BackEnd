import express from "express";
import { connectMongoDb } from './config/mongoDb.config.js';
import session from "express-session";
import MongoStore from "connect-mongo";
import router from "./routes/index.js";

const app = express();
const PORT = 8080;

connectMongoDb();

app.use(express.json());

app.use(session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://juanchilucero:Milanesas2024@e-commerce.mzjqjcs.mongodb.net/?retryWrites=true&w=majority&appName=e-commerce",
        ttl: 15
    }),
    secret: "CodigoSecreto",
    resave: true
}));

app.use("/api", router);





app.listen(PORT, () => {
console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
