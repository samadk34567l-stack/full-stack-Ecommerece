import "./ProductTabs.css";

export default function ProductTabs({ active, onChange }) {
  const tabs = ["Product Details", "Rating & Reviews", "FAQs"];
  return (
    <div className="product-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`product-tab ${active === tab ? "active" : ""}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
