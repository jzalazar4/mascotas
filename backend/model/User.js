import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
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
    firstName: { type: String },
    lastName: { type: String },
    profile: { type: String },

    
});

export default mongoose.model.Users || mongoose.model('User', UserSchema);