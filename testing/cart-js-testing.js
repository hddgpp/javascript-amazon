import {getCart, saveCart} from '../data/cart.js'

//Clear localStorage before testing
localStorage.clear();

//Test getCart on empty storage
console.log('Testing getCart')
console.assert(Array.isArray(getCart()) && getCart().length === 0, 'getCart should return empty array when nothing is stored');

//Test saveCart
console.log('Testing saveCart')
const testCart = [{ productId: 1, quantity: 2 }];
saveCart(testCart);

//Test getCart after saving
const savedCart = getCart();
console.assert(savedCart.length === 1, 'getCart should return array with 1 item');
console.assert(savedCart[0].productId === 1 && savedCart[0].quantity === 2, 'Cart item should match what was saved');

console.log('All tests passed!');
