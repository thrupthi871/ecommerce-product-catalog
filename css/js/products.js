const productsGrid = document.getElementById('productsGrid');
const skeletonLoader = document.getElementById('skeletonLoader');
const categoriesContainer = document.getElementById('categoriesContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const minPriceInput = document.getElementById('minPriceInput');
const maxPriceInput = document.getElementById('maxPriceInput');
const applyPriceFilterBtn = document.getElementById('applyPriceFilterBtn');
const clearPriceFilterBtn = document.getElementById('clearPriceFilterBtn');
const emptyState = document.getElementById('emptyState');
const errorState = document.getElementById('errorState');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const retryFetchBtn = document.getElementById('retryFetchBtn');

let allProducts = [];
let allCategories = [];
let currentCategory = 'all';
let currentSort = 'default';
let searchQuery = '';
let currentPriceRange = { min: null, max: null };

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('category');
  if (catParam) currentCategory = catParam.toLowerCase();

  loadCatalog();
  initListeners();
});

function initListeners() {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCatalog();
  });

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCatalog();
  });

  applyPriceFilterBtn.addEventListener('click', () => {
    const minValue = parseFloat(minPriceInput.value);
    const maxValue = parseFloat(maxPriceInput.value);
    currentPriceRange.min = Number.isFinite(minValue) ? minValue : null;
    currentPriceRange.max = Number.isFinite(maxValue) ? maxValue : null;
    renderCatalog();
  });

  clearPriceFilterBtn.addEventListener('click', () => {
    minPriceInput.value = '';
    maxPriceInput.value = '';
    currentPriceRange = { min: null, max: null };
    renderCatalog();
  });

  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    currentSort = 'default';
    sortSelect.value = 'default';
    currentCategory = 'all';
    minPriceInput.value = '';
    maxPriceInput.value = '';
    currentPriceRange = { min: null, max: null };
    renderCatalog();
  });
}

async function loadCatalog() {
  try {
    const [products, categories] = await Promise.all([
      getAllProducts(),
      getAllCategories()
    ]);
    allProducts = products;
    allCategories = categories;
    renderCategoryPills();
    renderCatalog();
  } catch (error) {
    skeletonLoader.style.display = 'none';
    errorState.style.display = 'flex';
  }
}

function renderCategoryPills() {
  const allBtn = categoriesContainer.querySelector('[data-category="all"]');
  categoriesContainer.innerHTML = '';
  allBtn.className = 'filter-btn';
  if (currentCategory === 'all') {
    allBtn.classList.add('active');
  }
  categoriesContainer.appendChild(allBtn);

  allCategories.forEach(category => {
    const btn = document.createElement('button');
    const normalizedCategory = category.toLowerCase();
    btn.className = `filter-btn${normalizedCategory === currentCategory.toLowerCase() ? ' active' : ''}`;
    btn.textContent = category;
    btn.setAttribute('data-category', category);
    categoriesContainer.appendChild(btn);
  });

  categoriesContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoriesContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentCategory = e.currentTarget.getAttribute('data-category');
      renderCatalog();
    });
  });
}

function setActiveCategoryButton() {
  categoriesContainer.querySelectorAll('.filter-btn').forEach(btn => {
    const category = btn.getAttribute('data-category') || 'all';
    btn.classList.toggle('active', category.toLowerCase() === currentCategory.toLowerCase());
  });
}

function filterByPriceRange(products, priceRange) {
  return products.filter(product => {
    if (!product || typeof product.price !== 'number') return false;
    if (priceRange.min !== null && product.price < priceRange.min) return false;
    if (priceRange.max !== null && product.price > priceRange.max) return false;
    return true;
  });
}

function renderCatalog() {
  skeletonLoader.style.display = 'none';
  setActiveCategoryButton();
  let filtered = filterByCategory(allProducts, currentCategory);
  filtered = searchProducts(filtered, searchQuery);
  filtered = filterByPriceRange(filtered, currentPriceRange);
  filtered = sortProducts(filtered, currentSort);

  const existingCards = productsGrid.querySelectorAll('.product-card');
  existingCards.forEach(c => c.remove());

  if (filtered.length === 0) {
    emptyState.style.display = 'flex';
    productsGrid.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  productsGrid.style.display = 'grid';

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="img-container"><img src="${product.image}" alt="${product.title}" loading="lazy"></div>
      <div class="category-tag">${product.category}</div>
      <a href="product.html?id=${product.id}"><h3 class="product-title">${product.title}</h3></a>
      <div class="price-row"><span class="price-value">$${product.price.toFixed(2)}</span></div>
      <div class="card-actions">
        <a href="product.html?id=${product.id}" class="btn btn-secondary">Details</a>
        <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `;

    card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
      addToCart(product, 1);
      showToast(`${product.title.substring(0, 20)}... added to cart!`, 'success');
    });
    productsGrid.appendChild(card);
  });
}