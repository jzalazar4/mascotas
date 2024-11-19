import express from "express";
import { signup, login, logout, verifyEmail } from "../controllers/auth.controller.js";
const router = express.Router();

// rutas de la pagina
/* Asi es sin el controller
router.get("/signup", (req, res) => {
    res.send("Signup route");
})
*/
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/verify-email", verifyEmail);

/*
router.get("/signup", (req, res) => {
    res.send("Signup route");
})*/

export default router;