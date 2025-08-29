import { getCart, saveCart } from '../data/cart.js';
import { products } from '../data/products.js';

const cartQunaity = document.querySelector('.cart-quantity');

// Create quantity selector
export function createQuantitySelector() {
  const select = document.createElement('select');
  for (let i = 1; i <= 10; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }
  return select;
}

// Create "Added to Cart" element
export function createAddedToCartElement() {
  const addedDiv = document.createElement('div');
  addedDiv.classList.add('added-to-cart');

  const checkmark = document.createElement('img');
  checkmark.src = 'images/icons/checkmark.png';
  addedDiv.appendChild(checkmark);
  addedDiv.appendChild(document.createTextNode('Added'));

  return addedDiv;
}

// Update cart quantity display
export function updateCartQuantityDisplay(cartQ) {
  const cart = getCart();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartQ) cartQ.textContent = totalQuantity;
  return totalQuantity;
}

// Create Add to Cart Button
export function createAddToCartButton(productId, select, addedToCart, cartQ) {
  const button = document.createElement('button');
  button.classList.add('add-to-cart-button', 'button-primary');
  button.dataset.productId = productId;
  button.textContent = 'Add to Cart';

  let addedTimer;

  function addedTimeOut() {
    addedToCart.style.opacity = 1;
    clearTimeout(addedTimer);
    addedTimer = setTimeout(() => {
      addedToCart.style.opacity = 0;
    }, 2000);
  }

  button.addEventListener('click', () => {
    const cart = getCart();
    const qty = Number(select.value);
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) existingItem.quantity += qty;
    else cart.push({ productId, quantity: qty, deliveryOptionId: '1' });

    saveCart(cart);
    updateCartQuantityDisplay(cartQ);
    addedTimeOut();
  });

  return button;
}

// Create Product Card
export function createProductCard(product, cartQ) {
  const productContainer = document.createElement('div');
  productContainer.classList.add('product-container');

  // Image
  const imgContainer = document.createElement('div');
  imgContainer.classList.add('product-image-container');
  const img = document.createElement('img');
  img.classList.add('product-image');
  img.src = product.image;
  imgContainer.appendChild(img);

  // Name
  const nameDiv = document.createElement('div');
  nameDiv.classList.add('product-name', 'limit-text-to-2-lines');
  nameDiv.textContent = product.name;

  // Rating
  const ratingContainer = document.createElement('div');
  ratingContainer.classList.add('product-rating-container');
  const starsImg = document.createElement('img');
  starsImg.classList.add('product-rating-stars');
  starsImg.src = `images/ratings/rating-${product.rating.stars * 10}.png`;
  const ratingCount = document.createElement('div');
  ratingCount.classList.add('product-rating-count', 'link-primary');
  ratingCount.textContent = product.rating.count;
  ratingContainer.appendChild(starsImg);
  ratingContainer.appendChild(ratingCount);

  // Price
  const priceDiv = document.createElement('div');
  priceDiv.classList.add('product-price');
  priceDiv.textContent = `$${(Math.round(product.priceCents) / 100).toFixed(2)}`;

  // Quantity
  const quantityContainer = document.createElement('div');
  quantityContainer.classList.add('product-quantity-container');
  const select = createQuantitySelector();
  quantityContainer.appendChild(select);

  // Extra info (from class)
  if (typeof product.extraInfoHTML === 'function') {
    const extraInfoDiv = document.createElement('div');
    extraInfoDiv.innerHTML = product.extraInfoHTML();
    extraInfoDiv.classList.add('product-extra-info');
    quantityContainer.appendChild(extraInfoDiv);
  }

  // Spacer
  const spacer = document.createElement('div');
  spacer.classList.add('product-spacer');

  // Added to cart
  const addedToCart = createAddedToCartElement();

  // Add to cart button
  const addButton = createAddToCartButton(product.id, select, addedToCart, cartQ);

  // Append all
  productContainer.appendChild(imgContainer);
  productContainer.appendChild(nameDiv);
  productContainer.appendChild(ratingContainer);
  productContainer.appendChild(priceDiv);
  productContainer.appendChild(quantityContainer);
  productContainer.appendChild(spacer);
  productContainer.appendChild(addedToCart);
  productContainer.appendChild(addButton);

  return productContainer;
}

//render all products 

/*export function renderProducts(container) {
  products.forEach(product => {
    const card = createProductCard(product, cartQunaity);
    container.appendChild(card);
  });
} */
