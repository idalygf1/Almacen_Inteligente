import mongoose from "mongoose";

const connectDBMongo = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mi_basededatos");
    console.log(" Conectado a MongoDB");
  } catch (error) {
    console.error(" Error al conectar a MongoDB:", error);
    throw error;
  }
};

export default connectDBMongo;
