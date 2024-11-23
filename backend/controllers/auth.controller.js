import bcrypt from "bcryptjs"
import { User } from "../model/User.js"
import { generateTokenAndCookie } from "../utils/generateTokenAndCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
    // el usuario envia ciertos datos
    const {email, password, name, lastName} = req.body;

    try {
        if(!email || !password || !name || !lastName ) {
            throw new Error("Completar todos los campos");
        }

        const userExist = await User.findOne({email});
        if(userExist) {
            return res.status(400).json({success:false, message: "El email ya está registrado"});
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        
        //token para enviar por email
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
        console.log("Fecha de expiración (UTC):", new Date(verificationTokenExpiresAt));
        console.log("Fecha de expiración (Local):", new Date(verificationTokenExpiresAt).toLocaleString());
        
        const newUser = new User({
            email, 
            password: hashedPassword, 
            name, 
            lastName, 
            verificationToken,
            verificationTokenExpiresAt,
        });
         console.log({
            token: verificationToken,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
         await newUser.save();

         //jwt
         generateTokenAndCookie(res, newUser._id);

         //enviar email con el token
         await sendVerificationEmail(newUser.email, verificationToken);

         res.status(201).json({
            success: true, 
            message: "El usuario se ha registrado correctamente", 
            user: newUser
        });
    } catch (error) {

    }
    res.send("Signup route");
}
export const verifyEmail = async (req, res) => {

    const {code} = req.body;
    try {
        const user = await User.findOne({ 
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: new Date() } 
        });

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
    res.send("Login route");
}
export const logout = async (req, res) => {
    res.send("Logout route");
}
