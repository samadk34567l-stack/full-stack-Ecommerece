import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import "./Breadcrumb.css";

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="breadcrumb-item">
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span className="breadcrumb-current">{item.label}</span>}
          {i < items.length - 1 && <FaChevronRight className="breadcrumb-sep" />}
        </span>
      ))}
    </nav>
  );
}
