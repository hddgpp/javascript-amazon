import { products, loadProducts } from '../data/products.js';
import { getCart, saveCart } from '../data/cart.js';
import { updateCartQuantityDisplay } from './amazon.product.js';
import { deliveryOptionArr } from "../data/deleveryOption.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

const returnToHomeLink = document.querySelector('.return-to-home-link');
const orderSummary = document.querySelector('.order-summary');
const paymentSummaryContainer = document.querySelector('.payment-summary');

// Load products first, then render everything
loadProducts(() => {
  const cart = getCart();

  // Update header quantity
  const totalQuantity = updateCartQuantityDisplay();
  returnToHomeLink.textContent = `Checkout ${totalQuantity} items`;

  // Render payment summary
  renderPaymentSummary(cart);

  // Render cart items
  renderCartItems(cart);
});

// --------------------- FUNCTIONS ---------------------

function calculateCartTotals(cart) {
  let itemsTotal = 0;
  let shippingTotal = 0;

  cart.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    if (!product) return;

    itemsTotal += product.priceCents * cartItem.quantity;

    const deliveryOption = deliveryOptionArr.find(opt => opt.id === cartItem.deliveryOptionId) || deliveryOptionArr[0];
    shippingTotal += deliveryOption.priceCent;
  });

  const subtotal = itemsTotal + shippingTotal;
  const estimatedTax = subtotal * 0.1; // 10% tax
  const orderTotal = subtotal + estimatedTax;

  return {
    itemsTotalCents: itemsTotal,
    shippingCents: shippingTotal,
    subtotalCents: subtotal,
    taxCents: estimatedTax,
    orderTotalCents: orderTotal
  };
}

function renderPaymentSummary(cart) {
  paymentSummaryContainer.innerHTML = ''; // clear previous
  const totals = calculateCartTotals(cart);
  const formatMoney = cents => `$${(cents / 100).toFixed(2)}`;

  const title = document.createElement('div');
  title.className = 'payment-summary-title';
  title.textContent = 'Order Summary';
  paymentSummaryContainer.appendChild(title);

  const rows = [
    { label: `Items (${cart.reduce((sum, i) => sum + i.quantity, 0)}):`, value: totals.itemsTotalCents },
    { label: 'Shipping & handling:', value: totals.shippingCents },
    { label: 'Total before tax:', value: totals.subtotalCents, className: 'subtotal-row' },
    { label: 'Estimated tax (10%):', value: totals.taxCents },
    { label: 'Order total:', value: totals.orderTotalCents, className: 'total-row' }
  ];

  rows.forEach(r => {
    const row = document.createElement('div');
    row.className = 'payment-summary-row';
    if (r.className) row.classList.add(r.className);

    const labelDiv = document.createElement('div');
    labelDiv.textContent = r.label;
    const valueDiv = document.createElement('div');
    valueDiv.className = 'payment-summary-money';
    valueDiv.textContent = formatMoney(r.value);

    row.appendChild(labelDiv);
    row.appendChild(valueDiv);
    paymentSummaryContainer.appendChild(row);
  });

  const placeOrderBtn = document.createElement('button');
  placeOrderBtn.className = 'place-order-button button-primary';
  placeOrderBtn.textContent = 'Place your order';
  paymentSummaryContainer.appendChild(placeOrderBtn);
}

function renderCartItems(cart) {
  orderSummary.innerHTML = '';

  if (cart.length === 0) {
    orderSummary.innerHTML = `<p>Your cart is empty.</p>
      <a href="amazon.html"><button class="button-primary">Home</button></a>`;
    paymentSummaryContainer.innerHTML = '';
    return;
  }

  cart.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    if (!product) return;

    const cartItemContainer = document.createElement('div');
    cartItemContainer.className = 'cart-item-container';

    // Delivery date
    const deliveryDate = document.createElement('div');
    deliveryDate.className = 'delivery-date';
    const defaultOption = deliveryOptionArr.find(opt => opt.id === cartItem.deliveryOptionId) || deliveryOptionArr[0];
    deliveryDate.textContent = `Delivery date: ${dayjs().add(defaultOption.deliveryDays, 'days').format('dddd, MMMM D')}`;
    cartItemContainer.appendChild(deliveryDate);

    // Grid container
    const detailsGrid = document.createElement('div');
    detailsGrid.className = 'cart-item-details-grid';
    cartItemContainer.appendChild(detailsGrid);

    // Product image
    const productImage = document.createElement('img');
    productImage.className = 'product-image';
    productImage.src = product.image;
    detailsGrid.appendChild(productImage);

    // Product details
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'cart-item-details';
    detailsGrid.appendChild(detailsDiv);

    const nameDiv = document.createElement('div');
    nameDiv.className = 'product-name';
    nameDiv.textContent = product.name;
    detailsDiv.appendChild(nameDiv);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'product-price';
    priceDiv.textContent = `$${(product.priceCents / 100).toFixed(2)}`;
    detailsDiv.appendChild(priceDiv);

    // Quantity controls
    const quantityDiv = document.createElement('div');
    quantityDiv.className = 'product-quantity';
    quantityDiv.innerHTML = `
      <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
      <span class="update-quantity-link link-primary">Update</span>
      <span class="delete-quantity-link link-primary">Delete</span>
    `;
    detailsDiv.appendChild(quantityDiv);

    const updateLink = quantityDiv.querySelector('.update-quantity-link');
    updateLink.addEventListener('click', () => handleUpdateQuantity(cartItem, quantityDiv));

    const deleteLink = quantityDiv.querySelector('.delete-quantity-link');
    deleteLink.addEventListener('click', () => handleDeleteItem(cartItem, cartItemContainer, cart));

    // Delivery options
    renderDeliveryOptions(cartItem, detailsGrid, cart);

    orderSummary.appendChild(cartItemContainer);
  });
}

// ------------------- HELPERS -------------------

function handleUpdateQuantity(cartItem, quantityDiv) {
  const updateInput = document.createElement('input');
  updateInput.type = 'number';
  updateInput.value = cartItem.quantity;
  updateInput.min = 1;

  const label = quantityDiv.querySelector('.quantity-label');
  label.replaceWith(updateInput);
  updateInput.focus();

  updateInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      const newQty = Number(updateInput.value);
      if (newQty > 0) {
        const cart = getCart();
        const idx = cart.findIndex(i => i.productId === cartItem.productId);
        if (idx !== -1) cart[idx].quantity = newQty;
        saveCart(cart);

        updateInput.replaceWith(label);
        label.textContent = newQty;

        const newTotal = updateCartQuantityDisplay();
        returnToHomeLink.textContent = `Checkout ${newTotal} items`;
        renderPaymentSummary(cart);
      }
    }
  });
}

function handleDeleteItem(cartItem, container, cart) {
  const idx = cart.findIndex(i => i.productId === cartItem.productId);
  if (idx !== -1) cart.splice(idx, 1);
  saveCart(cart);

  container.remove();
  const newTotal = updateCartQuantityDisplay();
  returnToHomeLink.textContent = `Checkout ${newTotal} items`;

  renderPaymentSummary(cart);
}

function renderDeliveryOptions(cartItem, detailsGrid, cart) {
  const deliveryDiv = document.createElement('div');
  deliveryDiv.className = 'delivery-options';
  detailsGrid.appendChild(deliveryDiv);

  const title = document.createElement('div');
  title.className = 'delivery-options-title';
  title.textContent = 'Choose a delivery option:';
  deliveryDiv.appendChild(title);

  deliveryOptionArr.forEach((option, index) => {
    const today = dayjs();
    const deliveryDay = today.add(option.deliveryDays, 'days');
    const deliveryString = deliveryDay.format('dddd, MMMM D');
    const priceString = option.priceCent === 0 ? 'Free' : `$${(option.priceCent / 100).toFixed(2)}`;

    const optionDiv = document.createElement('div');
    optionDiv.className = 'delivery-option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.className = 'delivery-option-input';
    input.name = `delivery-option-${cartItem.productId}`;
    input.checked = cartItem.deliveryOptionId === option.id || (!cartItem.deliveryOptionId && index === 0);
    optionDiv.appendChild(input);

    const infoDiv = document.createElement('div');
    const dateDiv = document.createElement('div');
    dateDiv.className = 'delivery-option-date';
    dateDiv.textContent = deliveryString;
    const priceDiv = document.createElement('div');
    priceDiv.className = 'delivery-option-price';
    priceDiv.textContent = `${priceString} Shipping`;

    infoDiv.appendChild(dateDiv);
    infoDiv.appendChild(priceDiv);
    optionDiv.appendChild(infoDiv);

    input.addEventListener('change', () => {
      if (input.checked) {
        const idx = cart.findIndex(i => i.productId === cartItem.productId);
        if (idx !== -1) {
          cart[idx].deliveryOptionId = option.id;
          saveCart(cart);
          renderPaymentSummary(cart);
        }
      }
    });

    deliveryDiv.appendChild(optionDiv);
  });
}
