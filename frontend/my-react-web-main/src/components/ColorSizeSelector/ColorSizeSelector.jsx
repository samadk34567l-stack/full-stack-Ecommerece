import { FaCheck } from "react-icons/fa";
import "./ColorSizeSelector.css";

export function ColorSelector({ colors, selected, onSelect }) {
  return (
    <div className="selector-block">
      <p className="selector-label">Select Colors</p>
      <div className="color-options">
        {colors.map((color) => (
          <button
            key={color}
            className={`color-swatch ${selected === color ? "active" : ""}`}
            style={{ background: color }}
            onClick={() => onSelect(color)}
            aria-label={`Select color ${color}`}
          >
            {selected === color && <FaCheck />}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SizeSelector({ sizes, selected, onSelect }) {
  return (
    <div className="selector-block">
      <p className="selector-label">Choose Size</p>
      <div className="size-options">
        {sizes.map((size) => (
          <button
            key={size}
            className={`size-btn ${selected === size ? "active" : ""}`}
            onClick={() => onSelect(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
