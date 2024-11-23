import express from "express";
import { signup, login, logout, verifyEmail, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
const router = express.Router();

// rutas de la pagina
/* Asi es sin el controller
router.get("/signup", (req, res) => {
    res.send("Signup route");
})
*/
router.post("/signup", signup);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/verify-email", verifyEmail);

router.post("/reset-password/:token", resetPassword);

router.post("/logout", logout);
/*
router.get("/signup", (req, res) => {
    res.send("Signup route");
})*/

export default router;