import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const app = express();
const PORT = 5000;

// Настройки путей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../frontend/cardsdata.json"); // путь к JSON файлу
const USERS_FILE = path.join(__dirname, "users.json");

app.use(cors());
app.use(express.json());

// --- Получить все новости ---
app.get("/api/news", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  res.json(data);
});

// --- Добавить новость ---
app.post("/api/news", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const newItem = {
    id: Date.now(),
    date: new Date().toLocaleDateString("ru-RU"),
    ...req.body,
  };
  data.unshift(newItem);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
  res.json(newItem);
});

// --- Удалить новость ---
app.delete("/api/news/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  data = data.filter((item) => item.id !== Number(req.params.id));
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
  res.json({ success: true });
});

// --- Обновить новость ---
app.put("/api/news/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const index = data.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Не найдено" });
  data[index] = { ...data[index], ...req.body };
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
  res.json(data[index]);
});


// Создаём файл, если его нет
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
// 🧾 Регистрация (email + username + password)
app.post("/register", (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ success: false, message: "Введите все поля (email, username, пароль)" });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(409).json({ success: false, message: "Пользователь с таким email уже существует" });
  }

  const newUser = { email, username, password };
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ success: true, message: "Регистрация прошла успешно" });
});

// 🔐 Авторизация (по email + password)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Введите email и пароль" });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: "Неверный email или пароль" });
  }

  res.json({
    success: true,
    token: "mock_token_" + Date.now(),
    username: user.username,
    email: user.email,
  });
});

app.listen(PORT, () => console.log(`✅ Сервер запущен: http://localhost:${PORT}`));
