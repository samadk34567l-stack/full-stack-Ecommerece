import { brands } from "../../data/products.js";
import "./Brands.css";

export default function Brands() {
  return (
    <section className="brands-bar" id="brands">
      {brands.map((b) => (
        <span key={b} className="brand-name">
          {b}
        </span>
      ))}
    </section>
  );
}
