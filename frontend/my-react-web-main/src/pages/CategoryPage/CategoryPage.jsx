import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FaSlidersH, FaChevronRight, FaChevronDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { allProducts as staticAllProducts } from "../../data/products.js";
import { fetchProducts } from "../../api.js";
import "./CategoryPage.css";

const CATEGORY_LINKS = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];
const SIZE_OPTIONS = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"];
const COLOR_OPTIONS = ["#2fb344", "#e53935", "#fdd835", "#fb8c00", "#29b6f6", "#1e40af", "#7c3aed", "#ec4899", "#ffffff", "#0d0d0d"];
const DRESS_STYLE_OPTIONS = ["Casual", "Formal", "Party", "Gym"];
const PAGE_SIZE = 9;

export default function CategoryPage() {
  const { style } = useParams();
  const label = style ? style.charAt(0).toUpperCase() + style.slice(1) : "Casual";

  const [products, setProducts] = useState(staticAllProducts);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[5]);
  const [priceRange, setPriceRange] = useState([50, 200]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts().then((list) => {
      if (list?.length) setProducts(list);
    });
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (style && p.dressStyle?.toLowerCase() !== style.toLowerCase()) return false;
      return p.price >= priceRange[0] && p.price <= priceRange[1] + 200;
    });
  }, [products, style, priceRange]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="category-page">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label }]} />

      <div className="category-layout">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            <FaSlidersH />
          </div>

          <ul className="filter-category-list">
            {CATEGORY_LINKS.map((c) => (
              <li key={c}>
                <span>{c}</span>
                <FaChevronRight />
              </li>
            ))}
          </ul>

          <div className="filter-block">
            <div className="filter-block-header">
              <h4>Price</h4>
              <FaChevronDown />
            </div>
            <input
              type="range"
              min="20"
              max="300"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="price-slider"
            />
            <div className="price-range-labels">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div className="filter-block">
            <div className="filter-block-header">
              <h4>Colors</h4>
              <FaChevronDown />
            </div>
            <div className="filter-color-grid">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  className={`filter-color-swatch ${selectedColor === c ? "active" : ""}`}
                  style={{ background: c, border: c === "#ffffff" ? "1px solid #ddd" : "none" }}
                  onClick={() => setSelectedColor(c)}
                  aria-label={`Filter by color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="filter-block">
            <div className="filter-block-header">
              <h4>Size</h4>
              <FaChevronDown />
            </div>
            <div className="filter-size-grid">
              {SIZE_OPTIONS.map((s) => (
                <button
                  key={s}
                  className={`filter-size-btn ${selectedSize === s ? "active" : ""}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <div className="filter-block-header">
              <h4>Dress Style</h4>
              <FaChevronDown />
            </div>
            <ul className="filter-category-list">
              {DRESS_STYLE_OPTIONS.map((d) => (
                <li key={d}>
                  <span>{d}</span>
                  <FaChevronRight />
                </li>
              ))}
            </ul>
          </div>

          <button className="apply-filter-btn">Apply Filter</button>
        </aside>

        <div className="category-results">
          <div className="category-results-header">
            <h1>{label}</h1>
            <div className="results-meta">
              <span>Showing 1-{paginated.length} of {filtered.length} Products</span>
              <span className="sort-by">
                Sort by: <strong>Most Popular</strong>
              </span>
            </div>
          </div>

          <div className="product-grid category-grid">
            {paginated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="pagination-row">
            <button
              className="pagination-arrow"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <FaArrowLeft /> Previous
            </button>
            <div className="pagination-numbers">
              {Array.from({ length: pageCount }).slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  className={`pagination-num ${page === i + 1 ? "active" : ""}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="pagination-arrow"
              disabled={page === pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              Next <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
