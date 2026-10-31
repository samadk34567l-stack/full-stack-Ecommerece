import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import StarRating from "../StarRating/StarRating.jsx";
import { useCart } from "../../context/CartContext.jsx";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        <button
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label="Toggle wishlist"
        >
          {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </button>
        {product.discount && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
      </Link>

      <Link to={`/product/${product.id}`}>
        <h3 className="product-name">{product.name}</h3>
      </Link>
      <StarRating rating={product.rating} />

      <div className="price-row">
        <span className="price">${product.price}</span>
        {product.oldPrice && (
          <span className="old-price">${product.oldPrice}</span>
        )}
      </div>

      <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
        <FaShoppingCart /> Add to Cart
      </button>
    </div>
  );
}
