import React, { useState, useEffect } from "react";
import "./Admin.css";
import { cardsData as initialData } from "../../cardsdata";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Admin = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Администратор";

  // Загружаем новости: из localStorage, если есть, иначе из initialData
  const [newsList, setNewsList] = useState(() => {
    const saved = localStorage.getItem("newsList");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [newCard, setNewCard] = useState({
    id: null,
    title: "",
    short_description: "",
    text: "",
    image: "",
  });

  useEffect(() => {
    localStorage.setItem("newsList", JSON.stringify(newsList));
  }, [newsList]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!newCard.title || !newCard.short_description || !newCard.text) {
      alert("Заполните все поля!");
      return;
    }

    if (newCard.id) {
      // Редактирование существующей новости
      const updatedList = newsList.map((item) =>
        item.id === newCard.id ? { ...newCard, date: item.date } : item
      );
      setNewsList(updatedList);
    } else {
      // Добавление новой новости
      const newItem = {
        ...newCard,
        id: Date.now(),
        date: new Date().toLocaleDateString("ru-RU"),
        image: newCard.image || "https://via.placeholder.com/150",
      };
      setNewsList([newItem, ...newsList]); // Вставляем в начало списка
    }

    setNewCard({ id: null, title: "", short_description: "", text: "", image: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту новость?")) {
      setNewsList(newsList.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (item) => {
    setNewCard({
      id: item.id,
      title: item.title,
      short_description: item.short_description,
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
        <button className="action-btn edit-icon" onClick={() => handleEdit(item)}>
          <span className="icon-placeholder">✏️</span>
        </button>
        <button className="action-btn delete-icon" onClick={() => handleDelete(item.id)}>
          <span className="icon-placeholder">🗑️</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <header className="header">
        <div className="header__logo">Новостной портал</div>
        <div className="header__user-controls">
          <span>Привет, {username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Выйти
          </button>
        </div>
      </header>

      <div className="admin-wrapper">
        <Link to="/dashboard" className="asde">{"<--"}На главную</Link>
        <h1 className="admin-page-title">Админ Панель</h1>
        <div className="admin-content-layout">
          <div className="admin-left-panel panel-card">
            <h2 className="panel-title">{newCard.id ? "Редактировать новость" : "Добавить новость"}</h2>
            <form className="add-form" onSubmit={handleAddOrUpdate}>
              <label className="form-label">Заголовок</label>
              <input
                type="text"
                name="title"
                placeholder="Введите заголовок"
                value={newCard.title}
                onChange={handleChange}
                className="form-input"
              />

              <label className="form-label">Краткое описание</label>
              <textarea
                name="short_description"
                placeholder="Введите краткое описание"
                value={newCard.short_description}
                onChange={handleChange}
                className="form-textarea"
                rows="2"
              />

              <label className="form-label">Полное содержание</label>
              <textarea
                name="text"
                placeholder="Введите полное содержание"
                value={newCard.text}
                onChange={handleChange}
                className="form-textarea"
                rows="5"
              />

              <label className="form-label">URL изображения</label>
              <input
                type="text"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={newCard.image}
                onChange={handleChange}
                className="form-input"
              />

              <button type="submit" className="add-button">
                {newCard.id ? "Сохранить" : "Добавить"}
              </button>
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
