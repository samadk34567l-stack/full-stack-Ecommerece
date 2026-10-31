import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "./StarRating.css";

export default function StarRating({ rating, showNumber = true }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="star-rating">
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f${i}`} className="star star-filled" />
      ))}
      {half && <FaStarHalfAlt className="star star-filled" />}
      {Array.from({ length: empty }).map((_, i) => (
        <FaRegStar key={`e${i}`} className="star star-empty" />
      ))}
      {showNumber && <span className="rating-number">{rating.toFixed(1)}/5</span>}
    </div>
  );
}
