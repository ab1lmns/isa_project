import express from "express";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from 'cors'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = "./users.json";
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;


app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "Все поля обязательны" });

  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  // Проверяем, есть ли пользователь
  if (users.find(u => u.email === email))
    return res.status(400).json({ message: "Пользователь уже существует" });

  // Хэшируем пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword
  };

  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.status(201).json({ message: "Пользователь создан" });
});

// --- Вход ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.email === email);

  if (!user) return res.status(400).json({ message: "Неверный email или пароль" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Неверный email или пароль" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ token, username: user.username, email: user.email });
});

// --- Защищенный роут ---
app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Нет токена" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "Вы авторизованы", userId: decoded.id, email: decoded.email });
  } catch (err) {
    res.status(401).json({ message: "Неверный токен" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
