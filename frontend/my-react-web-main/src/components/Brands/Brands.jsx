import "./Brands.css";

const brands = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

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
