const productsGrid = document.querySelector('.products-grid')

products.forEach((product) => {
  const productContainer = document.createElement('div')
  productContainer.classList.add('product-container')

  // Image
  const imageContainer = document.createElement('div')
  imageContainer.classList.add('product-image-container')
  const img = document.createElement('img')
  img.classList.add('product-image')
  img.src = product.image
  imageContainer.appendChild(img)

  // Name
  const nameDiv = document.createElement('div')
  nameDiv.classList.add('product-name', 'limit-text-to-2-lines')
  nameDiv.textContent = product.name

  // Rating
  const ratingContainer = document.createElement('div')
  ratingContainer.classList.add('product-rating-container')
  const starsImg = document.createElement('img')
  starsImg.classList.add('product-rating-stars')
  starsImg.src = `images/ratings/rating-${product.rating.stars * 10}.png`
  const ratingCount = document.createElement('div')
  ratingCount.classList.add('product-rating-count', 'link-primary')
  ratingCount.textContent = product.rating.count
  ratingContainer.appendChild(starsImg)
  ratingContainer.appendChild(ratingCount)

  // Price
  const priceDiv = document.createElement('div')
  priceDiv.classList.add('product-price')
  priceDiv.textContent = `$${(product.priceCents / 100).toFixed(2)}`

  // Quantity
  const quantityContainer = document.createElement('div')
  quantityContainer.classList.add('product-quantity-container')
  const select = document.createElement('select')
  for (let i = 1; i <= 10; i++) {
    const option = document.createElement('option')
    option.value = i
    option.textContent = i
    if (i === 1) option.selected = true
    select.appendChild(option)
  }
  quantityContainer.appendChild(select)

  // Spacer
  const spacer = document.createElement('div')
  spacer.classList.add('product-spacer')

  // Added to cart
  const addedToCart = document.createElement('div')
  addedToCart.classList.add('added-to-cart')
  const checkmarkImg = document.createElement('img')
  checkmarkImg.src = 'images/icons/checkmark.png'
  addedToCart.appendChild(checkmarkImg)
  addedToCart.appendChild(document.createTextNode('Added'))

  // Add to Cart button
  const addToCartButton = document.createElement('button')
  addToCartButton.classList.add('add-to-cart-button', 'button-primary',)
  addToCartButton.setAttribute('data-product-id', product.id);
  addToCartButton.textContent = 'Add to Cart'

  //Add to Cart button logic

  addToCartButton.addEventListener('click', () => {
    const productId = addToCartButton.dataset.productId
    const productQuantity = parseInt(select.value)
    const existingProduct = cart.find(item => item.productId === productId)

  if (existingProduct) {
    existingProduct.quantity += productQuantity
  } else {
    cart.push({
      productId: productId,
      quantity: productQuantity
    });
  }
    console.log(cart)
  });
  

  // Append all
  productContainer.appendChild(imageContainer)
  productContainer.appendChild(nameDiv)
  productContainer.appendChild(ratingContainer)
  productContainer.appendChild(priceDiv)
  productContainer.appendChild(quantityContainer)
  productContainer.appendChild(spacer)
  productContainer.appendChild(addedToCart)
  productContainer.appendChild(addToCartButton)
  productsGrid.appendChild(productContainer)
});