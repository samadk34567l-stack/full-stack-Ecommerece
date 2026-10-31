import { Link } from "react-router-dom";
import { FaTimes, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useCart } from "../../context/CartContext.jsx";
import "./CartDrawer.css";

export default function CartDrawer({ open, onClose }) {
  const { items, updateQty, removeFromCart, totalPrice } = useCart();

  return (
    <>
      <div className={`drawer-overlay ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <h3>Your Cart ({items.length})</h3>
          <button onClick={onClose} aria-label="Close cart">
            <FaTimes />
          </button>
        </div>

        <div className="cart-drawer-items">
          {items.length === 0 && <p className="empty-cart">Your cart is empty.</p>}
          {items.map((item) => (
            <div className="cart-item" key={item.cartKey}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <p className="cart-item-name">{item.name}</p>
                {(item.size || item.color) && (
                  <p className="cart-item-variant">
                    {item.size && <>Size: {item.size} </>}
                    {item.color && <>Color: {item.color}</>}
                  </p>
                )}
                <p className="cart-item-price">${item.price}</p>
                <div className="qty-controls">
                  <button onClick={() => updateQty(item.cartKey, item.qty - 1)}>
                    <FaMinus />
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.cartKey, item.qty + 1)}>
                    <FaPlus />
                  </button>
                </div>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.cartKey)}
                aria-label="Remove item"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span>Subtotal</span>
              <span>${totalPrice}</span>
            </div>
            <Link to="/cart" className="checkout-btn" onClick={onClose}>
              Go to Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
