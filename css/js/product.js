const detailSkeleton = document.getElementById('detailSkeleton');
const detailContent = document.getElementById('detailContent');
const errorState = document.getElementById('errorState');
const breadcrumb = document.getElementById('breadcrumb');

const breadcrumbCategory = document.getElementById('breadcrumbCategory');
const breadcrumbTitle = document.getElementById('breadcrumbTitle');
const productImage = document.getElementById('productImage');
const productCategory = document.getElementById('productCategory');
const productTitle = document.getElementById('productTitle');
const productPrice = document.getElementById('productPrice');
const productDescription = document.getElementById('productDescription');
const starsWrapper = document.getElementById('starsWrapper');
const reviewsCount = document.getElementById('reviewsCount');

const qtyInput = document.getElementById('qtyInput');
const qtyMinusBtn = document.getElementById('qtyMinusBtn');
const qtyPlusBtn = document.getElementById('qtyPlusBtn');
const addToCartBtn = document.getElementById('addToCartBtn');
const relatedGrid = document.getElementById('relatedGrid');
const relatedSection = document.getElementById('relatedSection');

let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));
  const debugEl = document.getElementById('debugInfo');
  if (debugEl) {
    debugEl.style.display = 'block';
    debugEl.textContent = `Debug: query=${window.location.search}, parsedId=${productId}`;
  }

  if (!productId || isNaN(productId)) {
    console.warn('No valid product ID found; attempting to load the first available product.');
    loadFirstAvailableProduct();
    return;
  }

  loadProductDetails(productId);
});

async function loadProductDetails(id) {
  try {
    const product = await getProductById(id);
    currentProduct = product;
    renderProduct();
    initPurchaseControls();
    loadRelatedProducts(product.category, product.id);
  } catch (error) {
    showError(error.message || 'Unable to load this product.');
    console.error('Product details failed:', error);
  }
}

async function loadFirstAvailableProduct() {
  try {
    const products = await getAllProducts();
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('No products available from the API.');
    }

    currentProduct = products[0];
    renderProduct();
    initPurchaseControls();
    loadRelatedProducts(currentProduct.category, currentProduct.id);
  } catch (error) {
    showError(error.message || 'Unable to load any product details.');
    console.error('Fallback product load failed:', error);
  }
}

function showError(message) {
  detailSkeleton.style.display = 'none';
  if (errorState) {
    errorState.style.display = 'flex';
  }

  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage) {
    errorMessage.textContent = message || 'Unable to load this product. Please try again later.';
  }

  const debugEl = document.getElementById('debugInfo');
  if (debugEl) {
    debugEl.style.display = 'block';
    debugEl.textContent = `Debug: ${message || 'no additional error available'}`;
  }
}

function renderProduct() {
  breadcrumbCategory.textContent = currentProduct.category;
  breadcrumbTitle.textContent = currentProduct.title;
  productImage.src = currentProduct.image;
  productCategory.textContent = currentProduct.category;
  productTitle.textContent = currentProduct.title;
  productPrice.textContent = `$${currentProduct.price.toFixed(2)}`;
  productDescription.textContent = currentProduct.description;

  detailSkeleton.style.display = 'none';
  detailContent.style.display = 'grid';
  breadcrumb.style.display = 'flex';
}

function initPurchaseControls() {
  qtyMinusBtn.addEventListener('click', () => {
    let currentQty = parseInt(qtyInput.value) || 1;
    if (currentQty > 1) qtyInput.value = currentQty - 1;
  });
  qtyPlusBtn.addEventListener('click', () => {
    let currentQty = parseInt(qtyInput.value) || 1;
    if (currentQty < 99) qtyInput.value = currentQty + 1;
  });
  addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(qtyInput.value) || 1;
    addToCart(currentProduct, quantity);
    showToast(`${quantity}x ${currentProduct.title.substring(0, 20)}... added to cart!`, 'success');
  });
}

async function loadRelatedProducts(category, currentId) {
  try {
    const products = await getProductsByCategory(category);
    const related = products.filter(item => item.id !== currentId).slice(0, 4);
    if (related.length === 0) return;

    relatedGrid.innerHTML = related.map(prod => `
      <div class="product-card">
        <div class="img-container"><img src="${prod.image}" alt="${prod.title}"></div>
        <div class="category-tag">${prod.category}</div>
        <a href="product.html?id=${prod.id}"><h3 class="product-title">${prod.title}</h3></a>
        <div class="price-row"><span class="price-value">$${prod.price.toFixed(2)}</span></div>
        <div class="card-actions">
          <a href="product.html?id=${prod.id}" class="btn btn-secondary">Details</a>
          <button class="btn btn-primary add-to-cart-btn" data-id="${prod.id}">Add to Cart</button>
        </div>
      </div>
    `).join('');

    relatedSection.style.display = 'block';
  } catch (error) {
    relatedSection.style.display = 'none';
  }
}