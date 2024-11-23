import bcrypt from "bcryptjs"
import crypto from 'crypto'

import { User } from "../model/User.js"
import { generateTokenAndCookie } from "../utils/generateTokenAndCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
    const { email, password, name, lastName } = req.body;

    try {
        if (!email || !password || !name || !lastName) {
            throw new Error("Completar todos los campos");
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ success: false, message: "El email ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        // Arreglo del tiempo, no funcionaba con UTC
        const now = Date.now();
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpiresAt = new Date(now + 24 * 60 * 60 * 1000 + (5 * 60 * 1000));

        console.log("Token: ", verificationToken);
        console.log("Fecha de expiración (UTC):", verificationTokenExpiresAt);


        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            lastName,
            verificationToken,
            verificationTokenExpiresAt,
        });

        await newUser.save();

        generateTokenAndCookie(res, newUser._id);
        await sendVerificationEmail(newUser.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "El usuario se ha registrado correctamente",
            user: newUser,
        });
    } catch (error) {
        console.error("Error en el registro:", error.message);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};

export const verifyEmail = async (req, res) => {

    const { code } = req.body;
    console.log("Codigo recibido de verificacion: ", code);

    try {
        const user = await User.findOne({ 
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: new Date() } 
        });
    console.log("Usuario encontrado:", user);

        if (!user) {
            return res.status(400).json({success:false, message: "Token inválido o ha expirado"});
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiresAt = null;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

      //  generateTokenAndCookie(res, user._id);

      res.status(200).json({
        success: true,
        message: "Email de verificación enviado",
        user: {
            ...user._doc,
            password: undefined,
        },
    });
    } catch (error) {
        console.log("Error al enviar el email de verificación ", error);
		res.status(500).json({ success: false, message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ success: false, message: "Usuario no encontrado" });
            }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Contraseña incorrecta" });
        }
        generateTokenAndCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Login exitoso",
            user: {
               ...user._doc,
               password:  undefined,
            },
        });
    } catch (error) {
        console.log("Error en el login:", error.message);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }

};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Usuario no encontrado" });
        }

        //Generar un token para resetear contraseña
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hora

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // Enviar email para cambiar la contraseña
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Email de recuperación de contraseña enviado",
        });

    } catch (error) {
        console.log("Error al enviar el email: ", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};


export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out"});
    res.send("Logout route");
}
