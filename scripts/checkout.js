import { products } from '../data/products.js';
import { getCart, saveCart } from '../data/cart.js';
import { updateCartQuantityDisplay } from './amazon.product.js';
import { deliveryOptionArr } from "../data/deleveryOption.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

const returnToHomeLink = document.querySelector('.return-to-home-link');
let cart = getCart();

// Update header quantity
const totalQuantity = updateCartQuantityDisplay(); 
returnToHomeLink.textContent = `Checkout ${totalQuantity} items`;

const orderSummary = document.querySelector('.order-summary');
orderSummary.innerHTML = ''; // Clear any existing content

cart.forEach(cartItem => {
  const productId = cartItem.productId;

  const matchingProduct = products.find(p => p.id === productId);

  // Container
  const cartItemContainer = document.createElement('div');
  cartItemContainer.className = 'cart-item-container';

  // Delivery date
  const deliveryDate = document.createElement('div');
  deliveryDate.className = 'delivery-date';
  const defaultOption = deliveryOptionArr.find(opt => opt.id === cartItem.deliveryOptionId) || deliveryOptionArr[0];
  deliveryDate.textContent = `Delivery date: ${dayjs().add(defaultOption.deliveryDays, 'days').format('dddd, MMMM D')}`;
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

  // Quantity controls
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

  // Update quantity
  const updateLink = productQuantity.querySelector('.update-quantity-link');
  updateLink.addEventListener('click', () => {
    const updateInput = document.createElement('input');
    updateInput.type = 'number';
    updateInput.value = cartItem.quantity;
    updateInput.min = 1;

    const quantityLabel = productQuantity.querySelector('.quantity-label');
    quantityLabel.replaceWith(updateInput);

    updateInput.focus();

    updateInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const newQuantity = Number(updateInput.value);
        if (newQuantity > 0) {
          const index = cart.findIndex(item => item.productId === productId);
          if (index !== -1) {
            cart[index].quantity = newQuantity;
            saveCart(cart);
          }
          updateInput.replaceWith(quantityLabel);
          quantityLabel.textContent = newQuantity;

          const newTotal = updateCartQuantityDisplay();
          returnToHomeLink.textContent = `Checkout ${newTotal} items`;
        }
      }
    });
  });

  // Delete quantity
  const deleteLink = productQuantity.querySelector('.delete-quantity-link');
  deleteLink.addEventListener('click', () => {
    const index = cart.findIndex(item => item.productId === productId);
    if (index !== -1) {
      cart.splice(index, 1);
      saveCart(cart);
    }
    cartItemContainer.remove();
    const newTotal = updateCartQuantityDisplay();
    returnToHomeLink.textContent = `Checkout ${newTotal} items`;
  });

  // Delivery options
  const deliveryOptions = document.createElement('div');
  deliveryOptions.className = 'delivery-options';
  cartItemDetailsGrid.appendChild(deliveryOptions);

  const deliveryOptionsTitle = document.createElement('div');
  deliveryOptionsTitle.className = 'delivery-options-title';
  deliveryOptionsTitle.textContent = 'Choose a delivery option:';
  deliveryOptions.appendChild(deliveryOptionsTitle);

  deliveryOptionArr.forEach((option, index) => {
    const today = dayjs();
    const deliveryDay = today.add(option.deliveryDays, 'days');
    const deliveryString = deliveryDay.format('dddd, MMMM D');

    const priceString = option.priceCent === 0
      ? 'Free'
      : `$${(option.priceCent / 100).toFixed(2)}`;

    const deliveryOption = document.createElement('div');
    deliveryOption.className = 'delivery-option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.className = 'delivery-option-input';
    input.name = `delivery-option-${productId}`;
    input.checked = cartItem.deliveryOptionId === option.id || (!cartItem.deliveryOptionId && index === 0);
    deliveryOption.appendChild(input);

    const optionInfo = document.createElement('div');
    const optionDate = document.createElement('div');
    optionDate.className = 'delivery-option-date';
    optionDate.textContent = deliveryString;
    optionInfo.appendChild(optionDate);

    const optionPrice = document.createElement('div');
    optionPrice.className = 'delivery-option-price';
    optionPrice.textContent = `${priceString} Shipping`;
    optionInfo.appendChild(optionPrice);

    deliveryOption.appendChild(optionInfo);
    deliveryOptions.appendChild(deliveryOption);

    // Update delivery selection
    input.addEventListener('change', () => {
      if (input.checked) {
        deliveryDate.textContent = `Delivery date: ${deliveryString}`;
        const index = cart.findIndex(item => item.productId === productId);
        if (index !== -1) {
          cart[index].deliveryOptionId = option.id;
          saveCart(cart);
        }
      }
    });
  });

  orderSummary.appendChild(cartItemContainer);
});

if (cart.length === 0) {
  orderSummary.innerHTML = `<p>Your cart is empty.</p>`;
}

console.log(cart);
