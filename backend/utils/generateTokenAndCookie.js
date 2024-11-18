import jwt from "jsonwebtoken";

// crear jwt, se envia el payload userId 
export const generateTokenAndCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.cookie("token", token, { 
        expires: new Date(Date.now() + 900000), 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7dias
        sameSite: "strict"  // solo funciona en el mismo sitio web (solo en HTTPS), csrf
    }); // 15 minutos
    return token;
};