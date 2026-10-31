import {
  allProducts as staticAllProducts,
  newArrivals as staticNewArrivals,
  topSelling as staticTopSelling,
  getProductById as getStaticProductById,
} from "./data/products.js";

const defaultBaseUrl =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
    ? "https://full-stack-backend-eight-pi.vercel.app/api"
    : "http://localhost:5000/api";

const rawApiUrl = (import.meta.env.VITE_API_URL || defaultBaseUrl)
  .trim()
  .replace(/\/+$/, "");

export const API_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl}/api`;

const DEFAULT_COLORS = ["#000000", "#31344F", "#2e4a3d"];
const DEFAULT_SIZES = ["Small", "Medium", "Large", "X-Large"];

export function normalizeProduct(p) {
  if (!p) return null;
  const id = String(p._id || p.id);
  const mainImage = p.image?.startsWith("/") || p.image?.startsWith("http")
    ? p.image
    : `/${p.image || "image-1.png"}`;

  const images =
    Array.isArray(p.images) && p.images.length > 0
      ? p.images.map((img) =>
          img.startsWith("/") || img.startsWith("http") ? img : `/${img}`
        )
      : [mainImage, mainImage, mainImage];

  const reviews = Array.isArray(p.reviews)
    ? p.reviews.map((r, idx) => ({
        id: String(r._id || r.id || `rev-${idx}`),
        name: r.name || "Customer",
        verified: r.verified !== false,
        rating: Number(r.rating) || 5,
        text: r.text || r.comment || "",
        date:
          r.date ||
          (r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Recently"),
      }))
    : [];

  return {
    ...p,
    id,
    _id: p._id || null,
    name: p.name || "Untitled Product",
    price: Number(p.price) || 0,
    oldPrice: p.originalPrice ?? p.oldPrice ?? null,
    discount: p.discount && Number(p.discount) > 0 ? Number(p.discount) : null,
    rating: Number(p.rating) || 4.5,
    image: mainImage,
    images,
    category: p.category || "T-shirts",
    dressStyle: p.dressStyle || "Casual",
    colors:
      Array.isArray(p.colors) && p.colors.length > 0
        ? p.colors
        : DEFAULT_COLORS,
    sizes:
      Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : DEFAULT_SIZES,
    description:
      p.description ||
      "Crafted from a soft and breathable fabric, offering superior comfort and style.",
    inStock: p.inStock !== false,
    isNewArrival: Boolean(p.isNewArrival),
    isTopSelling: Boolean(p.isTopSelling),
    reviews,
  };
}

let productsCachePromise = null;

export async function fetchProducts(forceRefresh = false) {
  if (!forceRefresh && productsCachePromise) {
    return productsCachePromise;
  }
  productsCachePromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(normalizeProduct);
      }
    } catch (err) {
      productsCachePromise = null;
      console.warn("Backend offline or unreachable, using local fallback products:", err.message);
    }
    return staticAllProducts;
  })();
  return productsCachePromise;
}

export async function fetchHomeSections() {
  const products = await fetchProducts();
  const isFromBackend = products !== staticAllProducts;
  if (!isFromBackend) {
    return {
      newArrivals: staticNewArrivals,
      topSelling: staticTopSelling,
      allProducts: staticAllProducts,
    };
  }
  const arrivals = products.filter((p) => p.isNewArrival);
  const selling = products.filter((p) => p.isTopSelling);
  return {
    newArrivals: arrivals.length > 0 ? arrivals : products.slice(0, 4),
    topSelling: selling.length > 0 ? selling : products.slice(0, 4),
    allProducts: products,
  };
}

export async function fetchProductById(id) {
  const staticMatch = getStaticProductById(id);
  try {
    if (/^[0-9a-fA-F]{24}$/.test(String(id))) {
      const res = await fetch(`${API_URL}/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        return normalizeProduct(data);
      }
    }
    const all = await fetchProducts();
    const byId = all.find((p) => String(p.id) === String(id));
    if (byId) return byId;
    if (staticMatch) {
      const byName = all.find(
        (p) => p.name.toLowerCase() === staticMatch.name.toLowerCase()
      );
      if (byName) return byName;
    }
    return staticMatch || null;
  } catch {
    return staticMatch || null;
  }
}

export async function submitProductReview(productId, reviewData) {
  const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Could not submit review");
  }
  return normalizeProduct(data.product);
}

export async function createStoreOrder(orderData) {
  const token = localStorage.getItem("shopco_token") || localStorage.getItem("berry_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to place order");
  }
  return data;
}

