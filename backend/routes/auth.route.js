import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
const router = express.Router();

// rutas de la pagina
/* Asi es sin el controller
router.get("/signup", (req, res) => {
    res.send("Signup route");
})
*/
router.get("/signup", signup);

router.get("/login", login);

router.get("/logout", logout);


/*
router.get("/signup", (req, res) => {
    res.send("Signup route");
})*/

export default router;