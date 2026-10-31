import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a className="logo" href="#top">SHOP.CO</a>
          <p>
            We have clothes that suit your style and which you're proud to
            wear. From women to men.
          </p>
          <div className="social-icons">
            <a href="#" aria-label="Twitter" className="social-outline"><FaTwitter /></a>
            <a href="#" aria-label="Facebook" className="social-filled"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram" className="social-outline"><FaInstagram /></a>
            <a href="#" aria-label="Github" className="social-outline"><FaGithub /></a>
          </div>
        </div>

        <div className="footer-col">
          <h5>COMPANY</h5>
          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Works</a>
          <a href="#">Career</a>
        </div>

        <div className="footer-col">
          <h5>HELP</h5>
          <a href="#">Customer Support</a>
          <a href="#">Delivery Details</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Privacy Policy</a>
        </div>

        <div className="footer-col">
          <h5>FAQ</h5>
          <a href="#">Account</a>
          <a href="#">Manage Deliveries</a>
          <a href="#">Orders</a>
          <a href="#">Payments</a>
        </div>

        <div className="footer-col">
          <h5>RESOURCES</h5>
          <a href="#">Free eBooks</a>
          <a href="#">Development Tutorial</a>
          <a href="#">How to - Blog</a>
          <a href="#">Youtube Playlist</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Shop.co © 2000-2026, All Rights Reserved</p>
        <div className="payment-icons">
          <span className="pay-badge pay-visa">VISA</span>
          <span className="pay-badge pay-mc">Mastercard</span>
          <span className="pay-badge pay-pp">PayPal</span>
          <span className="pay-badge pay-ap">Apple Pay</span>
          <span className="pay-badge pay-gp">G Pay</span>
        </div>
      </div>
    </footer>
  );
}
