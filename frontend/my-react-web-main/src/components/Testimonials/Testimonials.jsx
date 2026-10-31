import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import StarRating from "../StarRating/StarRating.jsx";
import { testimonials } from "../../data/products.js";
import "./Testimonials.css";

const PER_PAGE = 3;

export default function Testimonials() {
  const [start, setStart] = useState(0);
  const maxStart = Math.max(0, testimonials.length - PER_PAGE);

  function prev() {
    setStart((s) => Math.max(0, s - 1));
  }
  function next() {
    setStart((s) => Math.min(maxStart, s + 1));
  }

  const visible = testimonials.slice(start, start + PER_PAGE);

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2 className="section-title">Our Happy Customers</h2>
        <div className="testimonial-arrows">
          <button onClick={prev} disabled={start === 0} aria-label="Previous">
            <FaArrowLeft />
          </button>
          <button onClick={next} disabled={start === maxStart} aria-label="Next">
            <FaArrowRight />
          </button>
        </div>
      </div>

      <div className="testimonials-grid">
        {visible.map((t) => (
          <div className="testimonial-card" key={t.id}>
            <StarRating rating={t.rating} showNumber={false} />
            <div className="testimonial-name">
              {t.name} {t.verified && <FaCheckCircle className="verified-icon" />}
            </div>
            <p>"{t.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}
