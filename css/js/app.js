const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const cartBadge = document.querySelector('.cart-badge');

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  updateBadge();
});

window.addEventListener('cartUpdated', () => {
  updateBadge();
});

window.addEventListener('storage', (event) => {
  if (event.key === CART_STORAGE_KEY) {
    updateBadge();
  }
});

window.addEventListener('pageshow', () => {
  updateBadge();
});

function updateBadge() {
  if (!cartBadge) return;
  const count = getCartCount(); // Loaded globally from storage.js
  if (count > 0) {
    cartBadge.textContent = count;
    cartBadge.style.display = 'flex';
  } else {
    cartBadge.style.display = 'none';
  }
}

function initNavbar() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
}

function showToast(message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
    toast.addEventListener('animationend', () => {
      toast.remove();
      if (toastContainer.children.length === 0) toastContainer.remove();
    });
  }, 3000);
}