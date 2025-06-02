import * as func from '../helpers/functions';
import AppUrl from '../helpers/appUrl';
import dispatcher from '../helpers/dispatcher';
import config from '../config.js';
import components from '../components.js';
import messages from '../messages.js';
import Base from './base.js';

class Cart extends Base {
    static targetAttrName = 'data-cart';

    // #element //本体
    // #myAttrName //属性名
    // #message // メッセージ
    // #dispatcher // ajax
    // #processing

    /**
     *
     */
    constructor(element, targetAttrName = null) {
        super(element, targetAttrName)
    }

    /**
     *
     */
    init() {
        let obj = this;

        obj.itemContainer = obj.element.querySelector('[data-cart-item-container]');
        obj.checkoutEl = obj.element.querySelector('[data-cart-checkout]');

        obj.checkoutEl.addEventListener('click', function(e) {
            let disabled = func.toBoolean(this.getAttribute('aria-disabled'));
            if (disabled) {
                e.preventDefault();
            }
        });

        obj.itemContainer.addEventListener('itemChanged', function() {
            obj.refreshCheckout();
        });

        obj.refreshCheckout();
    }

    /**
     *
     **/
    refreshCheckout() {
        let obj = this;

        let firstchild = obj.itemContainer.querySelector('[data-cart-item]');
        if (!firstchild) {
            obj.checkoutEl.setAttribute('aria-disabled', true);
        } else {
            obj.checkoutEl.setAttribute('aria-disabled', false);
        }
    }

    /**
     *
     */
    static setup() {
        let attrName, elements;

        attrName = Cart.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        for (var i = 0; i < elements.length; i++) {
            new Cart(elements[i]);
        }
    }
}

export default Cart;