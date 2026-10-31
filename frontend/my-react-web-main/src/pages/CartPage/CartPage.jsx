import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaTag, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { createStoreOrder } from "../../api.js";
import "./CartPage.css";

export default function CartPage() {
  const {
    items,
    updateQty,
    removeFromCart,
    clearCart,
    subtotal,
    promo,
    discountAmount,
    deliveryFee,
    totalPrice,
    applyPromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [checkoutError, setCheckoutError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  function handleApplyPromo() {
    if (!promoInput.trim()) return;
    const result = applyPromoCode(promoInput);
    setPromoMessage(result.message);
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setCheckoutError("");
    if (!customerName.trim() || !customerEmail.trim() || !shippingAddress.trim()) {
      setCheckoutError("Please fill in your name, email, and shipping address.");
      return;
    }

    setPlacingOrder(true);
    try {
      const payload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
        discountAmount,
        deliveryFee,
        items: items.map((item) => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          selectedColor: item.color || "",
          selectedSize: item.size || "",
          image: item.image || "",
        })),
      };

      const created = await createStoreOrder(payload);
      setPlacedOrder(created);
      clearCart();
      setShowCheckout(false);
    } catch (err) {
      setCheckoutError(err.message || "Could not place order. Make sure the backend server is running.");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (placedOrder) {
    return (
      <div className="cart-page">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Order Confirmed" }]} />
        <div
          className="cart-empty-state"
          style={{
            background: "#f8faf9",
            padding: "48px 24px",
            borderRadius: "20px",
            border: "1px solid #d1e7dd",
            maxWidth: "560px",
            margin: "32px auto",
          }}
        >
          <FaCheckCircle style={{ fontSize: "48px", color: "#198754", marginBottom: "16px" }} />
          <h2 style={{ marginBottom: "8px" }}>Thank You, {placedOrder.customerName}!</h2>
          <p style={{ marginBottom: "8px", color: "#555" }}>
            Your order has been placed and saved to the database.
          </p>
          <p style={{ fontWeight: 700, marginBottom: "20px" }}>
            Order ID: #{String(placedOrder._id || "").slice(-6).toUpperCase()} &bull; Total: ${placedOrder.totalAmount}
          </p>
          <Link to="/" className="shop-now-btn" onClick={() => setPlacedOrder(null)}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
      <h1 className="cart-page-title">YOUR CART</h1>

      {items.length === 0 ? (
        <div className="cart-empty-state">
          <p>Your cart is empty.</p>
          <Link to="/" className="shop-now-btn">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-page-grid">
          <div className="cart-items-panel">
            {items.map((item, i) => (
              <div className="cart-page-item" key={item.cartKey}>
                <img src={item.image} alt={item.name} />
                <div className="cart-page-item-info">
                  <div className="cart-page-item-top">
                    <h3>{item.name}</h3>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.cartKey)}
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  {item.size && <p className="variant-line">Size: <span>{item.size}</span></p>}
                  {item.color && <p className="variant-line">Color: <span>{item.color}</span></p>}
                  <div className="cart-page-item-bottom">
                    <p className="cart-page-item-price">${item.price}</p>
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
                </div>
                {i < items.length - 1 && <div className="cart-item-divider" />}
              </div>
            ))}
          </div>

          <div className="order-summary-panel">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            {promo && (
              <div className="summary-row discount-row">
                <span>Discount (-{promo.percent}%)</span>
                <span>-${discountAmount}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>${deliveryFee}</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>

            <div className="promo-row">
              <div className="promo-input-wrap">
                <FaTag className="promo-icon" />
                <input
                  type="text"
                  placeholder="Add promo code (SAVE10 / SAVE20)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
              </div>
              <button className="apply-btn" onClick={handleApplyPromo}>
                Apply
              </button>
            </div>
            {promoMessage && <p className="promo-message">{promoMessage}</p>}

            {!showCheckout ? (
              <button className="checkout-main-btn" onClick={() => setShowCheckout(true)}>
                Go to Checkout <FaArrowRight />
              </button>
            ) : (
              <form
                onSubmit={handlePlaceOrder}
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid #eee",
                  display: "grid",
                  gap: "12px",
                }}
              >
                <h3 style={{ fontSize: "16px", margin: 0 }}>Shipping Details</h3>
                {checkoutError && (
                  <p style={{ color: "#d32f2f", fontSize: "13px", margin: 0 }}>{checkoutError}</p>
                )}
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #ddd" }}
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #ddd" }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #ddd" }}
                />
                <input
                  type="text"
                  placeholder="Shipping Address *"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #ddd" }}
                />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #ddd" }}
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Online Payment">Online Payment / Card</option>
                </select>
                <button type="submit" className="checkout-main-btn" disabled={placingOrder}>
                  {placingOrder ? "Placing Order..." : `Place Order ($${totalPrice})`} <FaArrowRight />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
