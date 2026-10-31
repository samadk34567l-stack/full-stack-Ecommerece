import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <div className="hero-content">
          <h1>
            FIND CLOTHES <br /> THAT MATCHES <br /> YOUR STYLE
          </h1>
          <p>
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <a href="#newarrivals" className="shop-now-btn">
            Shop Now
          </a>

          <div className="hero-stats">
            <div>
              <h4>200+</h4>
              <p>International Brands</p>
            </div>
            <div>
              <h4>2,000+</h4>
              <p>High-Quality Products</p>
            </div>
            <div>
              <h4>30,000+</h4>
              <p>Happy Customers</p>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img src="/hero.png" alt="Models wearing latest fashion" />
          <span className="sparkle sparkle-1">✦</span>
          <span className="sparkle sparkle-2">✦</span>
        </div>
      </div>
    </section>
  );
}
