import React from "react";
import "./Main.css";
import Navbar from "../Navbar/Navbar";
import cardsData from "../../../cardsdata.json";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <>
    <Navbar/>
    <h3 className="zas">Новостные порталы</h3>
    <div className="cards">
      {cardsData.map((card) => (
        <div key={card.id} className="card">
          <img src={card.image} alt={card.title} className="card__image" />
          <h3 className="card__title">{card.title}</h3>
          <p className="card__date">{card.date}</p>
          <p className="card__text">{card.text}</p>
          <Link to={`/news/${card.id}`} className="card__button">Подробнее</Link>
        </div>
      ))}
    </div>
    </>
  );
};

export default Main;