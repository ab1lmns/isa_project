import React, { useState, useEffect } from "react";
import "./Admin.css";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/news";

const Admin = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Администратор";

  const [newsList, setNewsList] = useState([]);
const [newCard, setNewCard] = useState({
  title: "",
  short_description: "",
  text: "",
  image: "",
});

const handleAddCard = () => {
  const nextId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 4;

  const cardToAdd = { ...newCard, id: nextId };

  setCards([...cards, cardToAdd]);
  setNewCard({
    title: "",
    short_description: "",
    text: "",
    image: "",
  });
};

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setNewsList)
      .catch((err) => console.error("Ошибка загрузки:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!newCard.title || !newCard.short_description || !newCard.text) {
      alert("Заполните все поля!");
      return;
    }

    if (newCard.id) {
      // Обновление
      const res = await fetch(`${API_URL}/${newCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });
      const updated = await res.json();
      setNewsList((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    } else {
      // Добавление
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });
      const added = await res.json();
      setNewsList((prev) => [added, ...prev]);
    }

    setNewCard({ id: null, title: "", short_description: "", text: "", image: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить эту новость?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setNewsList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setNewCard({
      id: item.id,
      title: item.title,
      fulltext: item.short_description,
      text: item.text,
      image: item.image,
    });
  };

  const NewsCard = ({ item }) => (
    <div className="news-card">
      <div className="news-card__content">
        <div className="news-card__title">{item.title}</div>
        <div className="news-card__text">
          {item.short_description || item.text.substring(0, 70) + "..."}
        </div>
        <div className="news-card__date">{item.date}</div>
      </div>
      <div className="news-card__actions">
        <button className="action-btn" onClick={() => handleEdit(item)}>✏️</button>
        <button className="action-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
      </div>
    </div>
  );

  return (
    <>
      <header className="header">
        <div className="header__logo">Новостной портал</div>
        <div className="header__user-controls">
          <span className="navbar__welcome">Добро пожаловать, {username}!</span>
          <button onClick={handleLogout} className="logout-btn">Выйти</button>
        </div>
      </header>

      <div className="admin-wrapper">
        <Link to="/dashboard" className="asde">← На главную</Link>
        <h1 className="admin-page-title">Админ Панель</h1>

        <div className="admin-content-layout">
          <div className="admin-left-panel panel-card">
            <h2 className="panel-title">{newCard.id ? "Редактировать" : "Добавить новость"}</h2>
            <form className="add-form" onSubmit={handleAddOrUpdate}>
              <input name="title" placeholder="Заголовок" value={newCard.title} onChange={handleChange} />
              <textarea name="short_description" placeholder="Краткое описание" value={newCard.short_description} onChange={handleChange} rows="2" />
              <textarea name="text" placeholder="Полное содержание" value={newCard.text} onChange={handleChange} rows="5" />
              <input name="image" placeholder="URL изображения" value={newCard.image} onChange={handleChange} />
              <button class="add-button" type="submit">{newCard.id ? "Сохранить" : "Добавить"}</button>
            </form>
          </div>

          <div className="admin-right-panel panel-card">
            <h2 className="panel-title">Список новостей</h2>
            <div className="news-list">
              {newsList.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
