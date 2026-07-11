/**
 * Filters products based on a search query matching their title
 * @param {Array} products - Array of product objects
 * @param {string} query - The search query string
 * @returns {Array} - Filtered list of products
 */
function searchProducts(products, query) {
  if (!query || typeof query !== 'string') return products;
  
  const cleanQuery = query.trim().toLowerCase();
  if (cleanQuery === '') return products;
  
  return products.filter(product => {
    const title = product.title ? product.title.toLowerCase() : '';
    const description = product.description ? product.description.toLowerCase() : '';
    return title.includes(cleanQuery) || description.includes(cleanQuery);
  });
}
