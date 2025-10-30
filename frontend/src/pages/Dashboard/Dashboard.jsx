import React from "react";
import "./Dashboard.css";
import { cardsData } from "../../cardsdata";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Пользователь";

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__logo">Новостной Портал</div>
        <div className="navbar__links">
            <h1>Добро пожаловать, {username}!</h1>
            <button onClick={handleLogout}>Выйти</button>
        </div>
      </nav>
      <Link to={`/admin`} className="admin__button">
              Админ панель
      </Link>
      <h3 className="zas">Последние новости</h3>
      
      <div className="cards">
        
        {cardsData.map((card) => (
          <div key={card.id} className="card">
            <img src={card.image} alt={card.title} className="card__image" />
            <h3 className="card__title">{card.title}</h3>
            <p className="card__date">{card.date}</p>
            <p className="card__text">{card.text}</p>
            <Link to={`/news/${card.id}`} className="card__button">
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
