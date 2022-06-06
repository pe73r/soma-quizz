window.customElements.define("cart-progress-step", class CartProgressStep extends HTMLElement {});
window.customElements.define(
  "cart-progress-bar",
  class CartProgressBar extends HTMLElement {
    constructor() {
      super();
    }
  }
);

let cartListener;
document.addEventListener("DOMContentLoaded", () => {
  if (!cartListener) {
    cartListener = new CartListener();
  }
});
class CartListener {
  constructor() {
    document.addEventListener("cart:updated", this.onCartUpdated);
    this.init();
  }

  init = async () => {
    const res = await fetch("/cart.js");
    const cart = await res.json();
    console.log({ cart });
    await this.onCartUpdated({ detail: { cart } });
  };

  addProducts = (ids) => {
    return fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        items: ids.map((id) => ({
          id,
          quantity: 1,
          properties: {
            isFree: "true"
          }
        }))
      })
    });
  };

  onCartUpdated = async ({ detail: { cart } }) => {
    const CARD_ID = 42865099997423;
    const PRODUCT_ID = 42833756717295;
    const DISCOUNT_FOR_CARD = 10000;
    const DISCOUNT_FOR_PRODUCT = 15000;

    const price = cart.items.reduce((acc, item) => {
      if (!item.properties?.isFree) {
        acc += item.final_line_price;
      }
      return acc;
    }, 0);

    if (this.lastPrice === price) return;
    console.log("new cart", this.lastPrice, price);
    this.lastPrice = price;

    const shouldAddCard = price >= DISCOUNT_FOR_CARD;
    const shouldAddProduct = price >= DISCOUNT_FOR_PRODUCT;

    const hasCard = cart.items.some((item) => item.variant_id === CARD_ID && !!item.properties.isFree);
    const hasProduct = cart.items.some((item) => item.variant_id === PRODUCT_ID && !!item.properties.isFree);

    let hasChanged = false;
    let updates = {};
    let add = [];
    if (!hasCard && shouldAddCard) {
      add.push(CARD_ID);
    } else if (hasCard && !shouldAddCard) {
      Object.assign(updates, { [CARD_ID]: 0 });
    }

    if (!hasProduct && shouldAddProduct) {
      add.push(PRODUCT_ID);
    } else if (hasProduct && !shouldAddProduct) {
      Object.assign(updates, { [PRODUCT_ID]: 0 });
    }

    if (add.length) {
      await this.addProducts(add);
      hasChanged = true;
    }
    if (Object.keys(updates).length) {
      await fetch("/cart/update.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          updates
        })
      });
      hasChanged = true;
    }

    if (hasChanged) {
      console.log("hasChanged!", this.lastPrice, price);
      await fetch("/cart.js");
      document.documentElement.dispatchEvent(
        new CustomEvent("cart:refresh", {
          bubbles: true
        })
      );
    }
  };
}
