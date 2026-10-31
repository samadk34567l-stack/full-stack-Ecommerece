import { useState } from "react";
import { FaSlidersH } from "react-icons/fa";
import ReviewCard from "../ReviewCard/ReviewCard.jsx";
import "./ReviewsList.css";

const PAGE_SIZE = 6;

export default function ReviewsList({ reviews = [], onAddReview }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const shown = reviews.slice(0, visible);
  const hasMore = visible < reviews.length;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || !onAddReview) return;
    setSubmitting(true);
    try {
      await onAddReview({ name: name.trim(), rating: Number(rating), comment: comment.trim() });
      setName("");
      setRating(5);
      setComment("");
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h3>
          All Reviews <span className="reviews-count">({reviews.length})</span>
        </h3>
        <div className="reviews-actions">
          <button className="filter-btn" aria-label="Filter reviews">
            <FaSlidersH />
          </button>
          <select className="sort-select" defaultValue="latest">
            <option value="latest">Latest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
          <button className="write-review-btn" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "24px",
            display: "grid",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>
          <textarea
            rows={3}
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              resize: "vertical",
            }}
          />
          <div>
            <button type="submit" className="write-review-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      <div className="reviews-grid">
        {shown.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {hasMore && (
        <button className="load-more-btn" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
          Load More Reviews
        </button>
      )}
    </section>
  );
}
