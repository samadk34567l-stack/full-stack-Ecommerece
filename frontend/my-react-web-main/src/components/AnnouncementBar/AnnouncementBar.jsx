import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./AnnouncementBar.css";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="announcement-bar">
      <p>
        Sign up and get 20% off to your first order. <a href="#newsletter">Sign Up Now</a>
      </p>
      <button aria-label="Close announcement" onClick={() => setVisible(false)}>
        <FaTimes />
      </button>
    </div>
  );
}
