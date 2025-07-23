import express from "express";
import morgan from "morgan";
import cors from "cors";
import connectDBMongo from "./config/db";
import { createDefaultUser } from "./utils/init";


// Importar rutas
import authRoutes from "./routes/auth.routes";
import roleRoutes from "./routes/role.routes";
import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";
import menuRoutes from './routes/menu.routes';




const app = express();

const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/api/role", roleRoutes);app.use('/api/menu', menuRoutes);


// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/orders", orderRoutes); // ✅ Esta es correcta
app.use("/api/products", productRoutes);

// Conexión y servidor
connectDBMongo()
  .then(() => {
    // Cambiar a una función async para usar await
    (async () => {
      await createDefaultUser();

      app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
      });
    })();
  })
  .catch((error) => {
    console.error("❌ Error al conectar a MongoDB", error);
  });
