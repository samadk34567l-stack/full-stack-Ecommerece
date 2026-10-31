import { useState } from "react";
import ProductCard from "../ProductCard/ProductCard.jsx";
import "./ProductSection.css";

const INITIAL_COUNT = 4;
const LOAD_STEP = 8;

export default function ProductSection({ title, products, id }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  function handleViewAll() {
    setVisibleCount((prev) => Math.min(prev + LOAD_STEP, products.length));
  }

  return (
    <section className="product-section" id={id}>
      <h2 className="section-title">{title}</h2>

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore ? (
        <button className="view-all-btn" onClick={handleViewAll}>
          View All
        </button>
      ) : (
        visibleCount > INITIAL_COUNT && (
          <button
            className="view-all-btn"
            onClick={() => setVisibleCount(INITIAL_COUNT)}
          >
            View Less
          </button>
        )
      )}
    </section>
  );
}
