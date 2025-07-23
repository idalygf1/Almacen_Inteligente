import mongoose from "mongoose";

const connectDBMongo = async () => {
  try {
    const mongoURI = process.env.MONGO_URI as string;
    await mongoose.connect(mongoURI);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    throw error;
  }
};

export default connectDBMongo;
