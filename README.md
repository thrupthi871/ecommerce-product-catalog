# ShopEase — Premium E-Commerce Product Catalog
ShopEase is a modern, responsive, and feature-rich e-commerce product catalog designed as a lightweight client-side web application. Built entirely with vanilla web technologies, it demonstrates responsive UI integration, asynchronous API loading, dynamic content manipulation, and shopping cart persistence.
## 🌟 Key Features
1. **Responsive Navigation Bar**: Sticky glassmorphic navbar with active link indicators, mobile slide-out navigation menu, and a live animating shopping cart count badge.
2. **Dynamic Arrivals & Showcase**: Fetches trending items dynamically from the API directly on the home page.
3. **Interactive Catalog**: A full products catalog fetching real-time items from the Fake Store API.
4. **Search & Filter Systems**: Case-insensitive instant search, category filtering (using visual pill buttons), and advanced sorting (by price ascending/descending, and ratings).
5. **Detailed Product Information**: Dynamic product details viewer showing custom star rating values, descriptions, categories, and direct cart operations.
6. **Related Items Panel**: Category-based suggestions panel that loads context-matching accessories/products.
7. **Shopping Cart Management**: Cart drawer panel loaded from LocalStorage. Includes quantity selectors, line item pricing totals, dynamically calculated shipping/taxes/totals, checkout actions, and empty cart placeholders.
8. **Skeleton Screens & Fail-safes**: Skeleton loaders for high-end UI load states, accompanied by beautiful visual error states when offline or request timeouts happen.
## 🛠️ Tech Stack
- **Structure**: HTML5
- **Style**: CSS3 (Vanilla Custom Variable Layouts, Media Queries, Glassmorphism, Animations)
- **Logic**: Modern Vanilla JavaScript (ES6 Modules, Fetch API, Async/Await)
- **API**: Fake Store API (`https://fakestoreapi.com`)
- **Persistence**: Web Storage API (`localStorage`)
## 📂 Project Structure
```text
ecommerce-product-catalog/
│
├── assets/
│   ├── images/
│   └── icons/
│
├── css/
│   ├── style.css         # Global resets, variable definitions, and typography
│   ├── products.css      # Catalog view grids, filters and skeleton blocks
│   ├── product.css       # Details grids, stars parser, and gallery containers
│   ├── cart.css          # Cart rows, summary tables, and empty states
│   └── responsive.css    # Unified tablet and mobile device media queries
│
├── js/
│   ├── api.js            # Unified async fetch layer wrappers
│   ├── storage.js        # LocalStorage cart setters/getters
│   ├── app.js            # Mobile navbar, badges updates and custom Toast systems
│   ├── products.js       # Products page rendering and filter bindings
│   ├── product.js        # Details render and related items fetcher
│   ├── cart.js           # Cart table items updates and summary math
│   ├── search.js         # Substring-based catalog search queries
│   └── filter.js         # List array sorting and category dividers
│
├── index.html            # Landing / Home Page
├── products.html         # Products Catalog List Page
├── product.html          # Individual Product Specification Page
├── cart.html             # Cart Drawer and Summary Checkout Page
└── README.md             # Project documentation
```
## 🚀 Running the Project
To experience ShopEase locally, you can serve it using a local HTTP server:
1. **Serve using Python**:
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:8000` in your web browser.
2. **Serve using Node.js (Live Server)**:
   ```bash
   npx live-server
   ```
3. **Direct File Open**:
   You can also double-click on `index.html` to run the project. Note that some browsers might block ES6 Module imports on the `file://` protocol due to CORS security policies. Serving via a local server (like Python or live-server) is highly recommended.

