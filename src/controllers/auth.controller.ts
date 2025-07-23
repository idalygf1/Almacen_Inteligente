import { Request, Response } from "express";
import { generateAccessToken } from "../utils/generateToke";
import dayjs from "dayjs";
import cache from "../utils/cache";
import { User } from "../models/user";
import { Types } from "mongoose";
import bcrypt from "bcryptjs";
import { Role } from "../models/role";
import { Order } from "../models/order";

// LOGIN (dinámico)
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const userId = user._id.toString();
    const accessToken = generateAccessToken(userId);
    cache.set(userId, accessToken, 60 * 15); // 15 minutos

    return res.json({
      message: "Login exitoso",
      accessToken,
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

// GET TTL TOKEN
export const getTimeToken = (req: Request, res: Response) => {
  const { userId } = req.params;
  const ttl = cache.getTtl(userId);

  if (!ttl) return res.status(404).json({ message: "Token no encontrado" });

  const now = Date.now();
  const timeToLiveSeconds = Math.floor((ttl - now) / 1000);
  const expTime = dayjs(ttl).format("HH:mm:ss");

  return res.json({
    message: "Token activo",
    expiraEn: `${timeToLiveSeconds} segundos`,
    horaExpiracion: expTime,
  });
};

// UPDATE TTL TOKEN
export const updateToken = (req: Request, res: Response) => {
  const { userId } = req.params;
  const ttl = cache.getTtl(userId);
  if (!ttl) return res.status(404).json({ message: "Token no encontrado" });

  const token = cache.get(userId);
  if (!token) return res.status(404).json({ message: "No se encontró el token" });

  const newTTL = 60 * 15;
  cache.set(userId, token, newTTL);

  return res.json({ message: "Token actualizado", nuevoTTL: `${newTTL} segundos` });
};

// GET ALL USERS
export const getAllUsers = async (req: Request, res: Response) => {
  const userList = await User.find();
  return res.json({ userList });
};

// GET USER BY ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ user });
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    res.status(500).json({ message: "Error al buscar usuario", error });
  }
};

// CREATE USER
export const createUser = async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      ...rest,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({
      message: "Usuario creado",
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({
      message: "Error al crear usuario",
      error,
    });
  }
};

// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID no válido" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      message: "Usuario actualizado correctamente",
      user: updatedUser,
    });

  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "El correo o nombre de usuario ya existe",
        error: error.keyValue,
      });
    }

    console.error("Error al actualizar usuario:", error);
    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message || error,
    });
  }
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID no válido" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      message: "Usuario eliminado correctamente",
      user: deletedUser,
    });

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      message: "Error al eliminar usuario",
      error: error.message || error,
    });
  }
};
