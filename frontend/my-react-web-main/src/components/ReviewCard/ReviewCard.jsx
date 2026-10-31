import { FaCheckCircle, FaEllipsisH } from "react-icons/fa";
import StarRating from "../StarRating/StarRating.jsx";
import "./ReviewCard.css";

export default function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <div className="review-top">
        <StarRating rating={review.rating} showNumber={false} />
        <button className="review-menu-btn" aria-label="More options">
          <FaEllipsisH />
        </button>
      </div>
      <div className="review-name">
        {review.name} {review.verified && <FaCheckCircle className="verified-icon" />}
      </div>
      <p className="review-text">"{review.text}"</p>
      <p className="review-date">Posted on {review.date}</p>
    </div>
  );
}
