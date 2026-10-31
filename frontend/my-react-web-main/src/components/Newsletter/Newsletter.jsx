import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import "./Newsletter.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setMessage("Thanks for subscribing! Check your inbox soon.");
    setEmail("");
  }

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="newsletter-inner">
        <h2>
          STAY UPTO DATE ABOUT <br /> OUR LATEST OFFERS
        </h2>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="newsletter-input-wrap">
            <FaEnvelope className="newsletter-input-icon" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit">Subscribe to Newsletter</button>
          {message && <p className="newsletter-message">{message}</p>}
        </form>
      </div>
    </section>
  );
}
