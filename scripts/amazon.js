// main.js (or amazon.js)
import { loadProducts } from '../data/products.js';
import { createProductCard } from './amazon.product.js';

// This function handles rendering the products once they're loaded
export function renderProducts(products) {
  const productsGrid = document.querySelector('.products-grid');
  const cartQ = document.querySelector('.cart-quantity');

  if (!productsGrid || !cartQ) {
    return; // Prevent crashes if elements are missing
  }

  // Clear previous content
  productsGrid.innerHTML = '';

  products.forEach(product => {
    const productCard = createProductCard(product, cartQ);
    productsGrid.appendChild(productCard);
  });
}

// Wait until DOM is fully loaded before doing anything
document.addEventListener('DOMContentLoaded', () => {
  loadProducts()
    .then(products => {
      renderProducts(products);
    })
    .catch(error => {
      console.error('Failed to load products:', error);
    });
});
