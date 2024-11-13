import express from "express";

const router = express.Router();

// rutas de la pagina
router.get("/signup", (req, res) => {
    res.send("Signup route");
})


export default router;