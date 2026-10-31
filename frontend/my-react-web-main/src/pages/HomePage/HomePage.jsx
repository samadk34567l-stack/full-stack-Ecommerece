import { useState, useEffect } from "react";
import Hero from "../../components/Hero/Hero.jsx";
import Brands from "../../components/Brands/Brands.jsx";
import ProductSection from "../../components/ProductSection/ProductSection.jsx";
import DressStyle from "../../components/DressStyle/DressStyle.jsx";
import Testimonials from "../../components/Testimonials/Testimonials.jsx";
import { newArrivals as staticNewArrivals, topSelling as staticTopSelling } from "../../data/products.js";
import { fetchHomeSections } from "../../api.js";
import "./HomePage.css";

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState(staticNewArrivals);
  const [topSelling, setTopSelling] = useState(staticTopSelling);

  useEffect(() => {
    let active = true;
    fetchHomeSections().then((sections) => {
      if (!active) return;
      if (sections.newArrivals?.length) setNewArrivals(sections.newArrivals);
      if (sections.topSelling?.length) setTopSelling(sections.topSelling);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Hero />
      <Brands />
      <ProductSection id="newarrivals" title="NEW ARRIVALS" products={newArrivals} />
      <div className="section-divider" />
      <ProductSection id="topselling" title="TOP SELLING" products={topSelling} />
      <DressStyle />
      <Testimonials />
    </>
  );
}
