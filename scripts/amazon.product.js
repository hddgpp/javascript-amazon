import { getCart, saveCart } from '../data/cart.js';

// Create the "Added to Cart" message element
export function createAddedToCartElement() {
  const addedToCart = document.createElement('div');
  addedToCart.classList.add('added-to-cart');

  const checkmarkImg = document.createElement('img');
  checkmarkImg.src = 'images/icons/checkmark.png';

  addedToCart.appendChild(checkmarkImg);
  addedToCart.appendChild(document.createTextNode('Added'));

  return addedToCart;
}

// Create quantity selector
export function createQuantitySelector() {
 const select = document.createElement('select');
  for (let i = 1; i <= 10; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    if (i === 1) option.selected = true;
    select.appendChild(option);
  }
  return select;
}

// Create Add to Cart button
export function createAddToCartButton(productId, select, addedToCart, cartQ) {
  const addToCartButton = document.createElement('button');
  addToCartButton.classList.add('add-to-cart-button', 'button-primary');
  addToCartButton.setAttribute('data-product-id', productId);
  addToCartButton.textContent = 'Add to Cart';

  let addedTimer;

  function addedTimeOut() {
    addedToCart.style.opacity = 1;
    clearTimeout(addedTimer);
    addedTimer = setTimeout(() => {
      addedToCart.style.opacity = 0;
    }, 2000);
  }
  function addBtnLogic() {
  const cart = getCart(); // pull latest cart from localStorage
  const productQuantity = parseInt(select.value);
  const existingProduct = cart.find(item => item.productId === productId);

  if (existingProduct) {
    existingProduct.quantity += productQuantity;
  } else {
    cart.push({
      productId,
      quantity: productQuantity
    });
  }

  // Save updated cart to localStorage
  saveCart(cart);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartQ.textContent = totalQuantity;
  console.log(cart);
}


  addToCartButton.addEventListener('click', () => {
    addBtnLogic();
    addedTimeOut();
  });

  return addToCartButton;
}

// Create the full product card
export function createProductCard(product, cartQ) {
  const productContainer = document.createElement('div');
  productContainer.classList.add('product-container');

  // Image
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('product-image-container');
  const img = document.createElement('img');
  img.classList.add('product-image');
  img.src = product.image;
  imageContainer.appendChild(img);

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
  priceDiv.textContent = `$${(product.priceCents / 100).toFixed(2)}`;

  // Quantity
  const quantityContainer = document.createElement('div');
  quantityContainer.classList.add('product-quantity-container');
  const select = createQuantitySelector();
  quantityContainer.appendChild(select);

  // Spacer
  const spacer = document.createElement('div');
  spacer.classList.add('product-spacer');

  // Added to cart
  const addedToCart = createAddedToCartElement();

  // Add to Cart button
  const addToCartButton = createAddToCartButton(product.id, select, addedToCart, cartQ);

  // Append all
  productContainer.appendChild(imageContainer);
  productContainer.appendChild(nameDiv);
  productContainer.appendChild(ratingContainer);
  productContainer.appendChild(priceDiv);
  productContainer.appendChild(quantityContainer);
  productContainer.appendChild(spacer);
  productContainer.appendChild(addedToCart);
  productContainer.appendChild(addToCartButton);

  return productContainer;
}
