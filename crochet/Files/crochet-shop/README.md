# 🧶 Knotted & Loved — Crochet E-Commerce Website

A full-featured handcrafted crochet business website built in pure HTML, CSS & JavaScript.

---

## 📁 File Structure

```
crochet-shop/
│
├── index.html        ← Main website (all pages)
├── style.css         ← Full stylesheet (responsive)
├── app.js            ← Cart, wishlist, modals, forms logic
├── products.js       ← Product catalog data
├── images/           ← (Create this folder for local images)
│   ├── hero-crochet.jpg
│   └── about-crochet.jpg
└── README.md
```

---

## 🚀 How to Run

1. Download / unzip all files into one folder.
2. Open `index.html` in any modern browser.
3. No build tools or server needed — it's 100% vanilla.

---

## 🖼️ Images Used (Free Unsplash URLs)

The website uses **Unsplash** images via direct URL. You can also save them locally:

| Section        | Image URL |
|----------------|-----------|
| Hero           | https://images.unsplash.com/photo-1610878180933-123b1f9296c5?w=600 |
| About          | https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600 |
| Boho Market Tote | https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400 |
| Sunflower Wall Hanging | https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400 |
| Mini Bear Amigurumi | https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400 |
| Sage Cardigan | https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400 |
| Hair Clips | https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=400 |
| Clutch Purse | https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400 |
| Plant Pot Sleeve | https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400 |
| Beach Hat | https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400 |
| Rainbow Keychain | https://images.unsplash.com/photo-1561985931-34e4f38fc4d4?w=400 |
| Chunky Pillow | https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400 |
| Mini Cactus | https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400 |
| Wrap Shawl | https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=400 |

> To save locally: right-click image → Save as → place in `images/` folder.

---

## ✅ Features Implemented

### 🛍️ Buy Side
- Product grid with 12 items across 5 categories
- Filter by category tabs + sort (price/popularity)
- Live search bar
- Product detail modal (click any card)
- Add to bag (cart)
- Quantity controls in cart
- Cart sidebar with total & free shipping indicator
- Wishlist sidebar with heart toggle
- Persistent cart & wishlist (localStorage)
- Discount badges, stock warnings

### ✏️ Customize
- Choose item type with live preview panel
- Color palette picker (8 swatches + custom text)
- Size selector (S/M/L/XL/Custom)
- Yarn type dropdown with price adjustment
- Monogram/name input
- Special instructions textarea
- Live price estimator
- Form submission with confirmation toast

### 🏪 Sell
- Seller application form
- Perks showcase section

### 🌐 General
- Sticky scrolling navbar
- Mobile-responsive hamburger menu
- Announcement bar
- Category quick-links
- Testimonials section
- About us section
- Newsletter signup
- Toast notifications
- Smooth scroll navigation
- Footer with social links

---

## 🎨 Design

- **Palette**: Terracotta · Sage Green · Warm Beige · Chocolate Brown
- **Fonts**: Playfair Display (headings) + DM Sans (body) via Google Fonts
- **Icons**: Font Awesome 6
- **Style**: Warm Organic · Artisan · Earthy Maximalist

---

## 💳 Payment Integration (Future)

To add real payments, integrate:
- **Razorpay** (India) → https://razorpay.com/docs
- **Stripe** (Global) → https://stripe.com/docs

Replace the `checkout()` function in `app.js` with your payment gateway's JS SDK.

---

Made with 🧶 and love.
