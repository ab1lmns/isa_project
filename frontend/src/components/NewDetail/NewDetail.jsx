import { useParams, Link } from "react-router-dom";
import { cardsData } from "../../cardsdata";
import Navbar from "../Navbar/Navbar";
import './NewDetail.css'

export default function NewsDetail() {
  const { id } = useParams();
  const news = cardsData.find((item) => item.id === Number(id));

  if (!news) return <p>Новость не найдена</p>;

  return (
    <>
    <Navbar/>
    <div className="news-detail">
      <Link to="/" className="btn">{" ← "}Назад к новостям</Link>
      <img src={news.image} alt={news.title} className="detail-img" />
      <p className="date">{news.date}</p>
      <h1>{news.title}</h1>
      <p>{news.fulltext}</p>
      <p>{news.fulltext}</p>
      <p>{news.fulltext}</p>
      
    </div>
      </>
  );
}
