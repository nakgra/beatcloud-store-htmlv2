import * as func from '../helpers/functions';
import AppUrl from '../helpers/appUrl';
import dispatcher from '../helpers/dispatcher';
import config from '../config.js';
import components from '../components.js';
import messages from '../messages.js';
import Base from './base.js';
import CartItem from './cartItem.js';

class Stashed extends Base {
    static targetAttrName = 'data-cart-stashed';

    // #element //本体
    // #myAttrName //属性名
    // #message // メッセージ
    // #dispatcher // ajax
    // #processing

    #productId
    #totalEl

    /**
     *
     */
    constructor(element, targetAttrName = null) {
        super(element, targetAttrName)

        let obj = this;
        obj.init();
    }

    /**
     *
     */
    init() {
        let obj = this;

        obj.productId = obj.element.getAttribute(obj.getMyAttrName());
        obj.cartItemTemplate = document.querySelector('[data-cart-item-template]');

        obj.totalEl = document.querySelector('[data-cart-total]');
        obj.cartCount = document.querySelector('[data-cartcount]');
        obj.moveEl = obj.element.querySelector('[' + obj.getMyAttrName('-move') + ']');

        obj.initElement();
        obj.initMove(obj.element, obj.productId);
    }

    /**
     *
     */
    initElement() {
        let obj = this;

        obj.element.addEventListener('animationend', function(e) {
            if (e.animationName == 'fadein') {
                func.removeClass(this, '-adding');
                func.removeClass(this, '-added');
            }

            if (e.animationName == 'fadeout') {
                this.remove();
            }
        })
    }

    /**
     *
     **/
    initMove(item, productId) {
        let obj = this;

        obj.moveEl.addEventListener('click', function(e) {
            e.preventDefault();
console.log('click');
            if (obj.processing) {
                return;
            }

            obj.setProcessing();

            let formData = new FormData;
            formData.append('product_id', productId);

            obj.dispatcher.post(AppUrl.url(config.actions.move_to_cart), formData)
                .then(function(response) { // success
                    obj.clearErrors();

                    let clone = obj.cartItemTemplate.content.firstElementChild.cloneNode(true);
                    clone.setAttribute('data-cart-item', response.data.product.id);

                    func.addClass(item, '-deleted');

                    let imageEl, hrefEl, qtyEl, incEl, priceEl, subtotalEl;
                    imageEl = clone.querySelector('[data-cart-item-image]');
                    hrefEl = clone.querySelector('[data-cart-item-href]');
                    qtyEl = clone.querySelector('[data-cart-item-qty]');
                    incEl = clone.querySelector('[data-cart-item-inc]');
                    priceEl = clone.querySelector('[data-cart-item-price]');
                    subtotalEl = clone.querySelector('[data-cart-item-subtotal]');

                    imageEl.src = response.data.product.image;
                    hrefEl.href = response.data.product.href;
                    hrefEl.innerText = response.data.product.name;
                    qtyEl.innerText = response.data.product.qty;
                    qtyEl.setAttribute('data-cart-item-qty', response.data.product.qty);
                    incEl.setAttribute('data-cart-item-qty', response.data.product.max_qty);
                    priceEl.innerText = response.data.product.price;
                    subtotalEl.innerText = response.data.product.subtotal;

                    let cartitemsContainer = document.querySelector('[data-cart-item-container]');
                    if (cartitemsContainer) {
                        func.addClass(clone, '-added');
                        cartitemsContainer.append(clone);
                        new CartItem(clone);
                    }

                    obj.totalEl.innerText = response.data.total;

                    if (parseInt(response.data.cart_qty) > 0) {
                        obj.cartCount.setAttribute('aria-hidden', false);
                        obj.cartCount.innerText = response.data.cart_qty;
                    } else {
                        obj.cartCount.setAttribute('aria-hidden', true);
                        obj.cartCount.innerText = '';
                    }
                })
                .catch(function(error) { // error
                    if (error.response) {
                        switch (error.response.status) {
                            case 401:
                                alert(messages.error.unauthorized);
                                break;
                            case 419:
                                alert(messages.error.csrf);
                                break;
                            case 422:
                                alert(messages.error.validation);
                                obj.showErrors(error.response.data.errors);
                                break;
                            case 404:
                                alert(messages.error.notfound);
                                break;
                            default:
                                alert(messages.error.exception);
                        }
                    } else if (error.request) {
                        // console.log(error.request);
                    } else {
                        // console.log('Error', error.message);
                    }
                })
                .then(function() {
                    obj.releaseProcessing();
                });
        });
    }

    /**
     *
     */
    static setup() {
        let attrName, elements;

        attrName = Stashed.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        for (var i = 0; i < elements.length; i++) {
            new Stashed(elements[i]);
        }
    }
}

export default Stashed;
