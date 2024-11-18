import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Por favor, ingrese su email"],
        unique: true,
    },
    password: {
        type: String, 
        required: [true, "Por favor, ingrese su contraseña"],
        unique: true,
    },
    name: {
        type: String,
        required: true 
    },
    lastName: { 
        type: String,
        required: true,
    },
    lastLogin: { 
        type: Date,
        default: Date.now, 
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String, 
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    
}, 
{
    timestamps: true
});

export const User = mongoose.model('User', userSchema);
//export default mongoose.model.Users || mongoose.model('User', userSchema);