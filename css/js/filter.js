/**
 * Filters a list of products by category
 * @param {Array} products 
 * @param {string} category 
 * @returns {Array}
 */
function filterByCategory(products, category) {
  if (!category || category === 'all') return products;
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
}
/**
 * Sorts products list based on selected sort type
 * @param {Array} products 
 * @param {string} sortType - ('price-asc', 'price-desc', 'rating-desc')
 * @returns {Array} - New sorted array
 */
function sortProducts(products, sortType) {
  const sorted = [...products]; // Create copy to avoid mutating original
  
  switch (sortType) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return sorted.sort((a, b) => {
        const rateA = a.rating ? a.rating.rate : 0;
        const rateB = b.rating ? b.rating.rate : 0;
        return rateB - rateA;
      });
    default:
      return sorted; // No sorting
  }
}
