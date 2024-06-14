import { Router } from "express";
import userController from "../controllers/userController.js";

const router = Router();

// registro
router.post("/register", async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await userController.create(userData);

    res.status(201).json({ status: "success", payload: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal server error" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userController.getByEmail(email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ status: "error", msg: "Email o Contraseña invalidos" });
    }
    
    // logica para la sesion
    req.session.user = {
      id: user._id,
      email: user.email,
      role: email === 'adminCoder@coder.com' ? 'admin' : 'user'
    };
    
    res.status(200).json({ status: "success", msg: "Logueado Exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal server error" });
  }
});

// ruta logout
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ status: "Error", msg: "Error al desloguear" });
        }
        res.status(200).json({ status: "success", msg: "Deslogueado Exitosamente" });
    });
});

export default router;
