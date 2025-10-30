import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // <-- твои стили

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Сохраняем данные пользователя
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);

        // Показываем приветствие
        setMessage(`Привет, ${data.username}! Вы вошли.`);

        // Через 0.5 секунды перенаправляем
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        setMessage(data.message || "Ошибка входа");
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка сервера");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Вход</h2>
        <span className="gray">Войдите в свой аккаунт</span>

        <label>Email</label>
        <input
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Пароль</label>
        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Войти</button>

        {message && <p className="register-message">{message}</p>}

        <p className="register-login-text">
          Еще нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
