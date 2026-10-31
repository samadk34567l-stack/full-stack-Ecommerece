# SHOP.CO — React Clone

Yeh ek pura Vite + React project hai jo upload ki gayi homepage image ko replicate karta hai, saath mein professional e-commerce features ke sath.

## Chalane ka tareeqa (Run kaise karein)

```bash
npm install
npm run dev
```

Phir browser mein `http://localhost:5173` khol lein.

Production build ke liye:
```bash
npm run build
npm run preview
```

## Folder Structure (kaunsa code kis file mein hai)

```
shopco/
├── index.html                  # HTML entry, Google Fonts link
├── package.json                # Dependencies (react, react-icons, vite)
├── vite.config.js              # Vite + React plugin config
├── src/
│   ├── main.jsx                # React ko #root div mein mount karta hai
│   ├── App.jsx                 # Sab sections ko jodta hai (page ka structure)
│   ├── index.css               # Pura design/CSS — sab sections ka styling yahan hai
│   │
│   ├── context/
│   │   └── CartContext.jsx     # Global cart + wishlist state (React Context API)
│   │
│   ├── data/
│   │   └── products.js         # Sara dummy data: products, brands, testimonials, dress styles
│   │
│   └── components/
│       ├── AnnouncementBar.jsx # Top wali black bar ("Sign up and get 20% off")
│       ├── Header.jsx          # Logo, nav menu, live search, cart icon, mobile menu
│       ├── CartDrawer.jsx      # Right side se khulne wala cart sidebar
│       ├── Hero.jsx            # "FIND CLOTHES THAT MATCHES YOUR STYLE" section
│       ├── Brands.jsx          # VERSACE / ZARA / GUCCI ... black strip
│       ├── ProductSection.jsx  # Reusable section (New Arrivals / Top Selling)
│       ├── ProductCard.jsx     # Ek product ka card (image, price, rating, add to cart)
│       ├── StarRating.jsx      # ⭐ rating stars component
│       ├── DressStyle.jsx      # "Browse By Dress Style" 4-box grid
│       ├── Testimonials.jsx    # Customer reviews carousel
│       ├── Newsletter.jsx      # Email subscribe box (validation ke sath)
│       └── Footer.jsx          # Neeche wala footer, links, payment icons
```

## Features jo add kiye gaye hain

1. **View All → 8 more products**: New Arrivals aur Top Selling dono sections mein shuru mein 4 products dikhte hain. "View All" button dabane se **8 aur products** aa jaate hain (total 12 tak), aur button "View Less" mein badal jata hai.
2. **Live Search**: Header ke search box mein type karte hi neeche dropdown mein matching products suggest hote hain (image + price ke sath).
3. **Cart System**: Add to Cart, quantity +/-, remove item, live subtotal — sab Context API se globally manage hota hai. Cart icon par badge count show hota hai.
4. **Wishlist**: Har product card par heart icon — click karke wishlist mein add/remove.
5. **Responsive Design**: Mobile par hamburger menu, grid columns automatically adjust hote hain.
6. **Dismissible Announcement Bar**: X button se band ho jati hai.
7. **Newsletter Form Validation**: Ghalat email par error, sahi par success message.
8. **Testimonials Carousel**: Left/right arrows se customer reviews slide hote hain.
9. **Star Ratings**: Har product/testimonial par dynamic star rating component (half-star support ke sath).

## Extend karne ke liye aage kya karein

- `src/data/products.js` mein apna real product data (ya API call) laga dein.
- Real backend/cart persistence ke liye `CartContext.jsx` ko `localStorage` ya API se jod dein.
- Har product ke liye ek `ProductDetail` page bana kar React Router add kar sakte hain.
- Checkout button ko Stripe/real payment gateway se connect kar sakte hain.
"# my-React-web" 
"# my-react-web" 
"# React-Ecommerce-web" 
"# React-Ecommerce-web" 
"# React-Ecommerce-web"  git init git add README.md git commit -m "Remove node_modules from tracking" git branch -M main git remote add origin https://github.com/samadk34567l-stack/React-Ecommerce-web.git git push -u origin main.
"# React-Ecommerce-web" 
"# my-react-web" 
