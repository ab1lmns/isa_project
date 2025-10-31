import React, { useEffect }from "react";
import "./Dashboard.css";
import cardsData from "../../../cardsdata.json";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      navigate("/login");
    }
  }, [username, navigate]);

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
            <span className="navbar__welcome">Добро пожаловать, {username}!</span>
              <button onClick={handleLogout} className="logout-btn">Выйти</button>
        </div>
      </nav>
      {username === "admin" && (
        <div className="admin__panel">
          <Link to="/admin" className="admin__button">
            Админ панель
          </Link>
        </div>
      )}

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
