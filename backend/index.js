import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./db/connectDB.js";

dotenv.config();
const app = express();

//mostrar en localhost
app.get("/", (req, res) => {
    res.send("Hola");
});

// puerto 3000
app.listen(3000, () => {
    connectDB();
    console.log("Server funciona");
});

