import { useParams, Link } from "react-router-dom";
import cardsData from "../../../cardsdata.json";

import "./NewDetail.css";

export default function NewsDetail() {
  const { id } = useParams();
  const news = cardsData.find((item) => item.id === Number(id));
  const username = localStorage.getItem("username");
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!news) {
    return (
      <div className="news-detail not-found">
        <p>Новость не найдена 😕</p>
        <Link to="/" className="btn">Вернуться на главную</Link>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar__logo">Новостной Портал</div>
        <div className="navbar__links">
            {!username ? (
            <>
              <a href="/register" className="navbar__link">Регистрация</a>
              <a href="/login" className="navbar__link">Вход</a>
            </>
          ) : (
            <>
              <span className="navbar__welcome">Добро пожаловать, {username}!</span>
              <button onClick={handleLogout} className="logout-btn">Выйти</button>
            </>
          )}
        </div>
      </nav>
      <div className="news-detail">
        <Link to={localStorage.getItem("username") ? "/dashboard" : "/"}  className="btn">
          ← Назад к новостям
        </Link>
        {news.image && (
          <img src={news.image} alt={news.title} className="detail-img" />
        )}
        <p className="date">{news.date}</p>
        <h1>{news.title}</h1>
        <p>{news.fulltext}</p>
        <p>{news.fulltext}</p>
        <p>{news.fulltext}</p>
      </div>
    </>
  );
}
