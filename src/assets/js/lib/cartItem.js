import * as func from '../helpers/functions';
import AppUrl from '../helpers/appUrl';
import dispatcher from '../helpers/dispatcher';
import config from '../config.js';
import components from '../components.js';
import messages from '../messages.js';
import Base from './base.js';
import Stashed from './stashed.js';

class CartItem extends Base {
    static targetAttrName = 'data-cart-item';

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
        super(element, targetAttrName);
    }

    /**
     *
     */
    init() {
        let obj = this;

        obj.productId = obj.element.getAttribute(obj.getMyAttrName());
        obj.totalEl = document.querySelector('[data-cart-total]');
        obj.cartCount = document.querySelector('[data-cartcount]');
        obj.container = document.querySelector('[data-cart-item-container]');

        obj.priceEl = obj.element.querySelector('[' + obj.getMyAttrName('-price') + ']');
        obj.qtyEl = obj.element.querySelector('[' + obj.getMyAttrName('-qty') + ']');
        obj.decEl = obj.element.querySelector('[' + obj.getMyAttrName('-dec') + ']');
        obj.incEl = obj.element.querySelector('[' + obj.getMyAttrName('-inc') + ']');
        obj.stashEl = obj.element.querySelector('[' + obj.getMyAttrName('-stash') + ']');
        obj.delEl = obj.element.querySelector('[' + obj.getMyAttrName('-del') + ']');
        obj.subTotalEl = obj.element.querySelector('[' + obj.getMyAttrName('-subtotal') + ']');

        obj.stashedItemTemplate = document.querySelector('[' + Stashed.targetAttrName + '-template]');

        obj.initElement();
        obj.initDecrement(obj.element, obj.productId);
        obj.initIncrement(obj.element, obj.productId);
        obj.initStash(obj.element, obj.productId);
        obj.initDelete(obj.element, obj.productId);

        obj.setQtyControl();
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
                obj.refreshCheckout();
            }
        })
    }

    /**
     *
     */
    setQtyControl() {
        let obj = this;

        obj.decEl.disabled = false;
        obj.incEl.disabled = false;

        let qty = obj.qtyEl.getAttribute(obj.getMyAttrName('-qty'));
        if (!func.isInt(qty)) {
            obj.decEl.disabled = true;
            obj.incEl.disabled = true;
            return;
        }

        qty = parseInt(qty);
        if (qty <= 1) {
            obj.decEl.disabled = true;
        }

        let max = obj.incEl.getAttribute(obj.getMyAttrName('-inc'));
        if (max) {
            if (!func.isInt(max) || qty >= parseInt(max)) {
                obj.incEl.disabled = true;
            }
        }
    }

    /**
     *
     **/
    refreshCheckout() {
        let obj = this;

        if (!obj.container) {
            return;
        }

        let event = new Event('itemChanged');
        obj.container.dispatchEvent(event);
    }

    /**
     *
     */
    initDecrement(item, id) {
        let obj = this;

        obj.decEl.addEventListener('click', function(e) {
            e.preventDefault();

            if (obj.processing) {
                return;
            }

            obj.setProcessing();

            let formData = new FormData;
            formData.append('product_id', obj.productId);

            obj.dispatcher.put(AppUrl.url(config.actions.cart.decrease), formData)
                .then(function(response) { // success
                    obj.clearErrors();

                    obj.priceEl.innerText = response.data.price;
                    obj.qtyEl.innerText = response.data.qty;
                    obj.qtyEl.setAttribute(obj.getMyAttrName('-qty'), response.data.qty);
                    obj.incEl.setAttribute(obj.getMyAttrName('-inc'), response.data.max_qty);
                    obj.subTotalEl.innerText = response.data.subtotal;
                    obj.totalEl.innerText = response.data.total;

                    obj.setQtyControl();
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
    initIncrement(item) {
        let obj = this;

        obj.incEl.addEventListener('click', function(e) {
            e.preventDefault();

            if (obj.processing) {
                return;
            }

            obj.setProcessing();

            let formData = new FormData;
            formData.append('product_id', obj.productId);

            obj.dispatcher.put(AppUrl.url(config.actions.cart.increase), formData)
                .then(function(response) { // success
                    obj.clearErrors();

                    obj.priceEl.innerText = response.data.price;
                    obj.qtyEl.innerText = response.data.qty;
                    obj.qtyEl.setAttribute(obj.getMyAttrName('-qty'), response.data.qty);
                    obj.incEl.setAttribute(obj.getMyAttrName('-inc'), response.data.max_qty);
                    obj.subTotalEl.innerText = response.data.subtotal;
                    obj.totalEl.innerText = response.data.total;

                    obj.setQtyControl();
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
    initStash(item) {
        let obj = this;

        if (!obj.stashEl) {
            return;
        }

        obj.stashEl.addEventListener('click', function(e) {
            e.preventDefault();

            if (obj.processing) {
                return;
            }

            obj.setProcessing();

            let formData = new FormData;
            formData.append('product_id', obj.productId);

            obj.dispatcher.post(AppUrl.url(config.actions.cart.stash), formData)
                .then(function(response) { // success
                    obj.clearErrors();

                    func.addClass(item, '-deleted');

                    let stashedContainer, clone, imageEl, hrefEl, priceEl, originalEl;
                    stashedContainer = document.querySelector('[data-cart-stashed-container]');
                    if (stashedContainer) {
                        let target = stashedContainer.querySelector('[data-cart-stashed="' + response.data.product.id + '"]');
                        if (target) {
                            priceEl = target.querySelector('[data-cart-stashed-price]');
                            originalEl = target.querySelector('[data-cart-stashed-original]');

                            priceEl.innerText = response.data.product.price;
                            if (response.data.product.original) {
                                originalEl.innerText = response.data.product.original;
                                func.removeClass(originalEl.parentNode, '-hide');
                            } else {
                                func.addClass(originalEl.parentNode, '-hide');
                            }
                        } else {
                            clone = obj.stashedItemTemplate.content.firstElementChild.cloneNode(true);
                            clone.setAttribute('data-cart-stashed', response.data.product.id);

                            imageEl = clone.querySelector('[data-cart-stashed-image]');
                            hrefEl = clone.querySelector('[data-cart-stashed-href]');
                            priceEl = clone.querySelector('[data-cart-stashed-price]');
                            originalEl = clone.querySelector('[data-cart-stashed-original]');

                            imageEl.src = response.data.product.image;
                            hrefEl.href = response.data.product.href;
                            hrefEl.innerText = response.data.product.name;
                            priceEl.innerText = response.data.product.price;
                            if (response.data.product.original) {
                                originalEl.innerText = response.data.product.original;
                                func.removeClass(originalEl.parentNode, '-hide');
                            } else {
                                func.addClass(originalEl.parentNode, '-hide');
                            }

                            func.addClass(clone, '-added');
                            stashedContainer.prepend(clone);
                            new Stashed(clone);
                        }
                    }

                    let navItem = document.querySelector('[data-cart-type="' + response.data.product.type + '"]');
                    if (navItem) {
                        let countEl = navItem.querySelector('[data-cart-type-count]');
                        if (response.data.cart_type_qty == '0') {
                            countEl.innerText = '';
                            func.removeClass(countEl, '-exists');
                        } else {
                            countEl.innerText = response.data.cart_type_qty;
                            func.addClass(countEl, '-exists');
                        }
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
    initDelete(item) {
        let obj = this;

        obj.delEl.addEventListener('click', function(e) {
            e.preventDefault();

            if (obj.processing) {
                return;
            }

            obj.setProcessing();

            let formData = new FormData;
            formData.append('product_id', obj.productId);

            let type = obj.container.getAttribute('data-cart-item-container');
            obj.dispatcher.put(AppUrl.url(config.actions.cart.delete, {type: type}), formData)
                .then(function(response) { // success
                    obj.clearErrors();

                    func.addClass(item, '-deleted');

                    let navItem = document.querySelector('[data-cart-type="' + type + '"]');
                    if (navItem) {
                        let countEl = navItem.querySelector('[data-cart-type-count]');
                        if (response.data.cart_type_qty == '0') {
                            countEl.innerText = '';
                            func.removeClass(countEl, '-exists');
                        } else {
                            countEl.innerText = response.data.cart_type_qty;
                            func.addClass(countEl, '-exists');
                        }
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

        attrName = CartItem.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        for (var i = 0; i < elements.length; i++) {
            new CartItem(elements[i]);
        }
    }
}

export default CartItem;