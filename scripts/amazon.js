import { products } from '../data/products.js';
import { createProductCard } from './product.js';

const productsGrid = document.querySelector('.products-grid');
const cartQ = document.querySelector('.cart-quantity');

products.forEach(product => {
  const productCard = createProductCard(product, cartQ);
  productsGrid.appendChild(productCard);
});
