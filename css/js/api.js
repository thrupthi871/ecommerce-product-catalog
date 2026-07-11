const API_BASE_URL = 'https://fakestoreapi.com';

async function fetchFromApi(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch failed for ${endpoint}:`, error);
    throw error;
  }
}

async function getAllProducts() {
  return await fetchFromApi('/products');
}

async function getProductById(id) {
  return await fetchFromApi(`/products/${id}`);
}

async function getAllCategories() {
  return await fetchFromApi('/products/categories');
}

async function getProductsByCategory(category) {
  const encodedCategory = encodeURIComponent(category);
  return await fetchFromApi(`/products/category/${encodedCategory}`);
}