import { useState } from "react";
import "./ProductGallery.css";

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);

  return (
    <div className="gallery">
      <div className="gallery-thumbs">
        {images.map((img, i) => (
          <button
            key={i}
            className={`gallery-thumb ${active === i ? "active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
          >
            <img src={img} alt={`${name} thumbnail ${i + 1}`} />
          </button>
        ))}
      </div>
      <div className="gallery-main">
        <img src={images[active]} alt={name} />
      </div>
    </div>
  );
}
