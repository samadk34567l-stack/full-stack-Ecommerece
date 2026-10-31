// Central product data. In a real app this would come from an API.
// Each array has 12 items so "View All" can reveal 8 more (4 shown -> 12 total).
// All images are read from the /public/images/ folder — just drop your files there
// with the matching names below (e.g. public/images/image-1.png).

const DEFAULT_COLORS = ["#4b4b3a", "#2e4a3d", "#2b2e4a"];
const DEFAULT_COLOR_NAMES = ["Olive", "Green", "Navy"];
const DEFAULT_SIZES = ["Small", "Medium", "Large", "X-Large"];
const DRESS_STYLES = ["Casual", "Formal", "Party", "Gym"];

const DEFAULT_DESCRIPTION =
  "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.";

const SAMPLE_REVIEWS = [
  { id: "r1", name: "Samantha D.", verified: true, rating: 4.5, date: "August 14, 2025", text: "I absolutely love this piece! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to." },
  { id: "r2", name: "Alex M.", verified: true, rating: 5, date: "August 15, 2025", text: "It exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this gets a thumbs up from me." },
  { id: "r3", name: "Ethan R.", verified: true, rating: 4.5, date: "August 16, 2025", text: "This is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect." },
  { id: "r4", name: "Olivia P.", verified: true, rating: 5, date: "August 17, 2025", text: "As a UI/UX enthusiast, I value simplicity and functionality. This piece not only represents those principles but also feels great to wear. It's evident real creativity went into it." },
  { id: "r5", name: "Liam K.", verified: true, rating: 5, date: "August 18, 2025", text: "A fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the maker's skill. It's like wearing a piece of art that reflects real passion." },
  { id: "r6", name: "Ava H.", verified: true, rating: 4.5, date: "August 19, 2025", text: "I'm not just wearing this; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout make it a genuine conversation starter." },
];

// Prefix every image filename with / so it resolves directly from the public folder.
function img(filename) {
  return `/${filename}`;
}

function withDetails(product, category = "T-shirts", index = 0) {
  const mainImage = img(product.image);
  return {
    ...product,
    image: mainImage,
    category,
    dressStyle: DRESS_STYLES[index % DRESS_STYLES.length],
    // Product detail gallery reuses the same image 3x by default.
    // If you have extra angle shots, just add them here manually, e.g.:
    // images: [mainImage, img("image-1-2.png"), img("image-1-3.png")]
    images: [mainImage, mainImage, mainImage],
    colors: DEFAULT_COLORS,
    colorNames: DEFAULT_COLOR_NAMES,
    sizes: DEFAULT_SIZES,
    description: DEFAULT_DESCRIPTION,
    reviews: SAMPLE_REVIEWS,
  };
}

export const newArrivals = [
  withDetails({ id: "na1", name: "T-shirt with Tape Details", price: 120, oldPrice: null, discount: null, rating: 4.5, image: "image-1.png" }, "T-shirts", 0),
  withDetails({ id: "na2", name: "Skinny Fit Jeans", price: 240, oldPrice: 260, discount: 20, rating: 3.5, image: "image-2.png" }, "Jeans", 1),
  withDetails({ id: "na3", name: "Checkered Shirt", price: 180, oldPrice: null, discount: null, rating: 4.5, image: "image-3.png" }, "Shirts", 2),
  withDetails({ id: "na4", name: "Sleeve Striped T-shirt", price: 130, oldPrice: 160, discount: 30, rating: 4.5, image: "image-4.png" }, "T-shirts", 3),
  withDetails({ id: "na5", name: "Vertical Striped Shirt", price: 212, oldPrice: 232, discount: 20, rating: 5.0, image: "image-5.png" }, "Shirts", 4),
  withDetails({ id: "na6", name: "Courage Graphic T-shirt", price: 145, oldPrice: null, discount: null, rating: 4.0, image: "image-6.png" }, "T-shirts", 5),
  withDetails({ id: "na7", name: "Loose Fit Bermuda Shorts", price: 80, oldPrice: null, discount: null, rating: 3.0, image: "image-7.png" }, "Shorts", 6),
  withDetails({ id: "na8", name: "Faded Skinny Jeans", price: 210, oldPrice: null, discount: null, rating: 4.5, image: "image-8.png" }, "Jeans", 7),
  withDetails({ id: "na9", name: "Full Sleeve Zip Hoodie", price: 190, oldPrice: 220, discount: 14, rating: 4.2, image: "image-13.png" }, "Hoodies", 8),
  withDetails({ id: "na10", name: "Classic Denim Jacket", price: 260, oldPrice: null, discount: null, rating: 4.7, image: "image-14.png" }, "Jackets", 9),
  withDetails({ id: "na11", name: "Relaxed Fit Cargo Pants", price: 175, oldPrice: 200, discount: 12, rating: 4.1, image: "image-15.png" }, "Pants", 10),
  withDetails({ id: "na12", name: "Round Neck Basic Tee", price: 95, oldPrice: null, discount: null, rating: 4.4, image: "image-16.png" }, "T-shirts", 11),
];

export const topSelling = [
  withDetails({ id: "ts1", name: "Vertical Striped Shirt", price: 212, oldPrice: 232, discount: 20, rating: 5.0, image: "image-17.png" }, "Shirts", 0),
  withDetails({ id: "ts2", name: "Courage Graphic T-shirt", price: 145, oldPrice: null, discount: null, rating: 4.0, image: "image-18.png" }, "T-shirts", 1),
  withDetails({ id: "ts3", name: "Loose Fit Bermuda Shorts", price: 80, oldPrice: null, discount: null, rating: 3.0, image: "image-19.png" }, "Shorts", 2),
  withDetails({ id: "ts4", name: "Faded Skinny Jeans", price: 210, oldPrice: null, discount: null, rating: 4.5, image: "image-20.png" }, "Jeans", 3),
  withDetails({ id: "ts5", name: "T-shirt with Tape Details", price: 120, oldPrice: null, discount: null, rating: 4.5, image: "image-21.png" }, "T-shirts", 4),
  withDetails({ id: "ts6", name: "Skinny Fit Jeans", price: 240, oldPrice: 260, discount: 20, rating: 3.5, image: "image-22.png" }, "Jeans", 5),
  withDetails({ id: "ts7", name: "Checkered Shirt", price: 180, oldPrice: null, discount: null, rating: 4.5, image: "image-23.png" }, "Shirts", 6),
  withDetails({ id: "ts8", name: "Sleeve Striped T-shirt", price: 130, oldPrice: 160, discount: 30, rating: 4.5, image: "image-24.png" }, "T-shirts", 7),
  withDetails({ id: "ts9", name: "Oversized Sweatshirt", price: 165, oldPrice: null, discount: null, rating: 4.3, image: "image-25.png" }, "Hoodies", 8),
  withDetails({ id: "ts10", name: "Slim Fit Chinos", price: 155, oldPrice: 175, discount: 11, rating: 4.6, image: "image-16.png" }, "Pants", 9),
  withDetails({ id: "ts11", name: "Utility Vest Jacket", price: 230, oldPrice: null, discount: null, rating: 4.0, image: "image-15.png" }, "Jackets", 10),
  withDetails({ id: "ts12", name: "Basic Polo Shirt", price: 110, oldPrice: null, discount: null, rating: 4.2, image: "image-14.png" }, "Shirts", 11),
];

export const allProducts = [...newArrivals, ...topSelling];

export function getProductById(id) {
  return allProducts.find((p) => p.id === id) || null;
}

export function getRelatedProducts(product, count = 4) {
  return allProducts.filter((p) => p.id !== product.id).slice(0, count);
}

export function getProductsByStyle(style) {
  if (!style || style === "all") return allProducts;
  return allProducts.filter(
    (p) => p.dressStyle.toLowerCase() === style.toLowerCase()
  );
}

export const brands = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

export const dressStyles = [
  { id: "casual", label: "Casual", image: img("image-9.png") },
  { id: "formal", label: "Formal", image: img("image-10.png") },
  { id: "party", label: "Party", image: img("image-11.png") },
  { id: "gym", label: "Gym", image: img("image-12.png") },
];

export const testimonials = [
  {
    id: "t1",
    name: "Sarah M.",
    verified: true,
    rating: 5,
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: "t2",
    name: "Alex K.",
    verified: true,
    rating: 5,
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    id: "t3",
    name: "James L.",
    verified: true,
    rating: 5,
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    id: "t4",
    name: "Maria D.",
    verified: true,
    rating: 5,
    text: "Shop.co made online shopping enjoyable again. Fast delivery, accurate sizing, and the customer support team is always ready to help. Highly recommended!",
  },
];
