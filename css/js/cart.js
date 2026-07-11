const cartGrid = document.getElementById('cartGrid');
const cartEmptyState = document.getElementById('cartEmptyState');
const orderCompleteState = document.getElementById('orderCompleteState');
const cartItemsList = document.getElementById('cartItemsList');

const summarySubtotal = document.getElementById('summarySubtotal');
const summaryShipping = document.getElementById('summaryShipping');
const summaryTax = document.getElementById('summaryTax');
const summaryTotal = document.getElementById('summaryTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

let checkoutComplete = false;

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();
  initCheckout();
});

function renderCartPage() {
  const items = getCart();
  if (items.length === 0) {
    cartGrid.style.display = 'none';
    cartEmptyState.style.display = checkoutComplete ? 'none' : 'block';
    orderCompleteState.style.display = checkoutComplete ? 'block' : 'none';
    return;
  }

  cartGrid.style.display = 'grid';
  cartEmptyState.style.display = 'none';
  orderCompleteState.style.display = 'none';
  checkoutComplete = false;

  cartItemsList.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${item.image}"></div>
      <div class="cart-item-details">
        <div class="cart-item-category">${item.category}</div>
        <a href="product.html?id=${item.id}"><h3 class="cart-item-title">${item.title}</h3></a>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-widget">
          <button class="qty-btn minus-qty" data-id="${item.id}">&minus;</button>
          <input type="number" class="qty-input qty-val" data-id="${item.id}" value="${item.quantity}">
          <button class="qty-btn plus-qty" data-id="${item.id}">&plus;</button>
        </div>
        <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
        <button class="remove-btn remove-item" data-id="${item.id}">Remove</button>
      </div>
    </div>
  `).join('');

  attachItemListeners();
  updateSummaryTotals();
}

function attachItemListeners() {
  cartItemsList.querySelectorAll('.plus-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'));
      const items = getCart();
      const current = items.find(i => i.id === id);
      if (current && current.quantity < 99) {
        updateCartQuantity(id, current.quantity + 1);
        renderCartPage();
      }
    });
  });

  cartItemsList.querySelectorAll('.minus-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'));
      const items = getCart();
      const current = items.find(i => i.id === id);
      if (current && current.quantity > 1) {
        updateCartQuantity(id, current.quantity - 1);
        renderCartPage();
      }
    });
  });

  cartItemsList.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'));
      removeFromCart(id);
      renderCartPage();
    });
  });
}

function updateSummaryTotals() {
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const shippingCost = subtotal >= 100 ? 0.00 : 9.99;
  const grandTotal = subtotal + shippingCost + tax;

  summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
  summaryShipping.textContent = shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`;
  summaryTax.textContent = `$${tax.toFixed(2)}`;
  summaryTotal.textContent = `$${grandTotal.toFixed(2)}`;
}

function initCheckout() {
  checkoutBtn.addEventListener('click', () => {
    showToast('Order completed!', 'success');
    clearCart();
    renderCartPage();
  });
}