const CART_STORAGE_KEY = 'shopease_cart';

function normalizeCartItem(item, fallbackQuantity = 1) {
  return {
    id: String(item.id),
    title: item.title || 'Untitled product',
    price: Number(item.price) || 0,
    image: item.image || '',
    category: item.category || 'General',
    quantity: Math.max(1, Number(item.quantity) || fallbackQuantity)
  };
}

function getCart() {
  try {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartJson) return [];

    const parsedCart = JSON.parse(cartJson);
    if (!Array.isArray(parsedCart)) return [];

    return parsedCart
      .filter(item => item && typeof item === 'object')
      .map(item => normalizeCartItem(item));
  } catch (error) {
    console.error('Failed to parse cart from local storage:', error);
    return [];
  }
}

function saveCart(cart) {
  try {
    const normalizedCart = Array.isArray(cart)
      ? cart.filter(item => item && typeof item === 'object').map(item => normalizeCartItem(item))
      : [];

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Failed to save cart to local storage:', error);
  }
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const normalizedProduct = normalizeCartItem(product, quantity);
  const existingItemIndex = cart.findIndex(item => String(item.id) === normalizedProduct.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += normalizedProduct.quantity;
  } else {
    cart.push(normalizedProduct);
  }

  saveCart(cart);
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const normalizedProductId = String(productId);
  const itemIndex = cart.findIndex(item => String(item.id) === normalizedProductId);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    saveCart(cart);
  }
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => String(item.id) !== String(productId));
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}