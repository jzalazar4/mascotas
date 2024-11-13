import mongoose from "mongoose";

export const connectDB  = async() => {
    try {
        console.log("mongo_uri: ", process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error al conectarse a MongoDB: ", error.message);
        process.exit(1); // si falla 1 es error, y 0 es exito`
    }
};