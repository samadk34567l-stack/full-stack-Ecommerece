import { Link } from "react-router-dom";
import { dressStyles } from "../../data/products.js";
import "./DressStyle.css";
export default function DressStyle() {
  return (
    <section className="dress-style-section">
      <div className="dress-style-inner">
        <h2 className="section-title">Browse By Dress Style</h2>
        <div className="dress-style-grid">
          {dressStyles.map((style) => (
            <Link
              to={`/category/${style.id}`}
              className={`dress-style-card style-${style.id}`}
              key={style.id}
            >
              <img src={style.image} alt={style.label} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
