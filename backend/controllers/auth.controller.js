import bcrypt from "bcryptjs"
import { User } from "../model/User.js";
import { generateTokenAndCookie } from "../utils/generateTokenAndCookie.js";

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

        const newUser = new User({
            email, 
            password: hashedPassword, 
            name, 
            lastName, 
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // expira en 24hs
         });

         await newUser.save();

         //jwt
         generateTokenAndCookie(res, newUser._id);
         res.status(201).json({
            success: true, 
            message: "El usuario se ha registrado correctamente", 
            user: newUser
        });
    } catch (error) {

    }
    res.send("Signup route");
}
export const login = async (req, res) => {
    res.send("Login route");
}
export const logout = async (req, res) => {
    res.send("Logout route");
}
