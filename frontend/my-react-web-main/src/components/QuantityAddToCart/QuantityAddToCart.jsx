import { FaMinus, FaPlus } from "react-icons/fa";
import "./QuantityAddToCart.css";

export default function QuantityAddToCart({ qty, setQty, onAdd }) {
  return (
    <div className="qty-cart-row">
      <div className="qty-stepper">
        <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
          <FaMinus />
        </button>
        <span>{qty}</span>
        <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
          <FaPlus />
        </button>
      </div>
      <button className="add-to-cart-main-btn" onClick={onAdd}>
        Add to Cart
      </button>
    </div>
  );
}
