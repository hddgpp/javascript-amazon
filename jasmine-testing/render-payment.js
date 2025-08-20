import { renderPaymentSummary } from "../scripts/checkout";

describe('renderPaymentSummary', () => {
  let mockContainer;

  beforeEach(() => {
    // create a div that simulates paymentSummaryContainer
    mockContainer = document.createElement('div');
    // assign it to the container your function uses
    paymentSummaryContainer = mockContainer;
  });

  it('renders the title and order total', () => {
    // set up a fake cart if needed
    cart = [{ productId: 1, quantity: 2, deliveryOptionId: 0 }];

    renderPaymentSummary();

    const title = mockContainer.querySelector('.payment-summary-title');
    expect(title.textContent).toBe('Order Summary');

    const totalRow = mockContainer.querySelector('.total-row .payment-summary-money');
    expect(totalRow.textContent).toBe(`$${(calculateCartTotals().orderTotalCents / 100).toFixed(2)}`);
  });
});
