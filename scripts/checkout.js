import { products } from '../data/products.js';
import { cart } from '../data/cart.js';

const orderSummary = document.querySelector('.order-summary');
orderSummary.innerHTML = ''; // Clear any existing content

cart.forEach(cartItem => {
  const productId = cartItem.productId;

  let matchingProduct;
  products.forEach(product => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  // Container
  const cartItemContainer = document.createElement('div');
  cartItemContainer.className = 'cart-item-container';

  // Delivery date
  const deliveryDate = document.createElement('div');
  deliveryDate.className = 'delivery-date';
  deliveryDate.textContent = 'Delivery date: Tuesday, June 21';
  cartItemContainer.appendChild(deliveryDate);

  // Grid container
  const cartItemDetailsGrid = document.createElement('div');
  cartItemDetailsGrid.className = 'cart-item-details-grid';
  cartItemContainer.appendChild(cartItemDetailsGrid);

  // Product image
  const productImage = document.createElement('img');
  productImage.className = 'product-image';
  productImage.src = matchingProduct.image;
  cartItemDetailsGrid.appendChild(productImage);

  // Product details
  const cartItemDetails = document.createElement('div');
  cartItemDetails.className = 'cart-item-details';
  cartItemDetailsGrid.appendChild(cartItemDetails);

  const productName = document.createElement('div');
  productName.className = 'product-name';
  productName.textContent = matchingProduct.name;
  cartItemDetails.appendChild(productName);

  const productPrice = document.createElement('div');
  productPrice.className = 'product-price';
  productPrice.textContent = `$${(matchingProduct.priceCents / 100).toFixed(2)}`;
  cartItemDetails.appendChild(productPrice);

  const productQuantity = document.createElement('div');
  productQuantity.className = 'product-quantity';
  productQuantity.innerHTML = `
    <span>
      Quantity: <span class="quantity-label">${cartItem.quantity}</span>
    </span>
    <span class="update-quantity-link link-primary">Update</span>
    <span class="delete-quantity-link link-primary">Delete</span>
  `;
  cartItemDetails.appendChild(productQuantity);

  const deleteLink = productQuantity.querySelector('.delete-quantity-link');
deleteLink.addEventListener('click', () => {
  // 1. Remove from cart array
  const index = cart.findIndex(item => item.productId === productId);
  if (index !== -1) {
    cart.splice(index, 1);
  }

  cartItemContainer.remove();

  console.log(`Deleted product with ID: ${productId}`);
});

  // Delivery options
  const deliveryOptions = document.createElement('div');
  deliveryOptions.className = 'delivery-options';
  cartItemDetailsGrid.appendChild(deliveryOptions);

  const deliveryOptionsTitle = document.createElement('div');
  deliveryOptionsTitle.className = 'delivery-options-title';
  deliveryOptionsTitle.textContent = 'Choose a delivery option:';
  deliveryOptions.appendChild(deliveryOptionsTitle);

  // Delivery options list
  const optionsData = [
    { date: 'Tuesday, June 21', price: 'FREE Shipping', checked: true },
    { date: 'Wednesday, June 15', price: '$4.99 - Shipping', checked: false },
    { date: 'Monday, June 13', price: '$9.99 - Shipping', checked: false }
  ];

  optionsData.forEach(option => {
    const deliveryOption = document.createElement('div');
    deliveryOption.className = 'delivery-option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.className = 'delivery-option-input';
    input.name = `delivery-option-${productId}`;
    input.checked = option.checked;
    deliveryOption.appendChild(input);

    const optionInfo = document.createElement('div');

    const optionDate = document.createElement('div');
    optionDate.className = 'delivery-option-date';
    optionDate.textContent = option.date;
    optionInfo.appendChild(optionDate);

    const optionPrice = document.createElement('div');
    optionPrice.className = 'delivery-option-price';
    optionPrice.textContent = option.price;
    optionInfo.appendChild(optionPrice);

    deliveryOption.appendChild(optionInfo);
    deliveryOptions.appendChild(deliveryOption);
  });

  // Append entire cart item to order summary
  orderSummary.appendChild(cartItemContainer);
});