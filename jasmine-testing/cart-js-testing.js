import {getCart, saveCart} from '../data/cart.js'
import { loadProducts } from '../data/products.js';


describe("Cart functions", () => {

beforeAll((done) => {
  loadProducts()
  done()
}) 

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("should return an empty array if no cart is saved", () => {
    expect(getCart()).toEqual([]);
  });

  it("should save and retrieve the cart correctly", () => {
    const fakeCart = [{ id: 1, quantity: 2 }];
    saveCart(fakeCart);

    const result = getCart();
    expect(result).toEqual(fakeCart);
  });

  it("should overwrite old cart when saving new one", () => {
    const cart1 = [{ id: 1, quantity: 2 }];
    const cart2 = [{ id: 99, quantity: 1 }];

    saveCart(cart1);
    saveCart(cart2);

    const result = getCart();
    expect(result).toEqual(cart2);
  });
});

