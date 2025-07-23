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


const app = express();

const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/api/role", roleRoutes);


// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api", orderRoutes); // puedes eliminar si es duplicada

// Conexión y servidor
connectDBMongo()
  .then(() => {
    // Cambiar a una función async para usar await
    (async () => {
      await createDefaultUser();

      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      });
    })();
  })
  .catch((error) => {
    console.error("❌ Error al conectar a MongoDB", error);
  });


app.use('/menu', require('./routes/menu.routes').default);
