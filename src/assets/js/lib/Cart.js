import * as func from '../helpers/functions';
import AppUrl from '../helpers/appUrl';
import dispatcher from '../helpers/dispatcher';
import config from '../config.js';
import components from '../components.js';
import messages from '../messages.js';

class CartItem {
    static targetAttrName = 'data-cart-item';

    #element //本体
    #myAttrName //属性名
    #message; // メッセージ
    #dispatcher; // ajax

    #productId;
    #processing;

    /**
     *
     */
    constructor(element, targetAttrName = null) {
        let obj = this;

        obj.element = element;
        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;
        obj.dispatcher = dispatcher();

        // obj.action = config.actions['cart'];
        obj.productId = obj.element.getAttribute(obj.getMyAttrName());

        // // obj.qtyInput = obj.element.querySelector('[data-qty]');
        // obj.sendButton = obj.element.querySelector('[' + obj.getMyAttrName('-send') + ']');
        // obj.viewcartButton = obj.element.querySelector('[' + obj.getMyAttrName('-view') + ']');

        // if (!obj.productId || !obj.sendButton || !obj.viewcartButton) {
        //     return;
        // }

        obj.sendButton.addEventListener('click', function(e) {
            e.preventDefault();

            if (obj.processing) {
                return;
            }

            obj.setProcessing();

            let formData = new FormData;
            formData.append('product_id', obj.productId);
            // formData.append('qty', obj.qtyInput.value);

            obj.dispatcher.post(AppUrl.url(obj.action), formData)
                .then(function(response) { // success
                    obj.clearErrors();

                    // obj.qtyInput.value = response.data.qty;
                    if (response.data.qty > 0) {
                        obj.sendButton.setAttribute('aria-hidden', true);
                        obj.viewcartButton.setAttribute('aria-hidden', false);
                    } else {
                        obj.sendButton.setAttribute('aria-hidden', false);
                        obj.viewcartButton.setAttribute('aria-hidden', true);
                    }

                    let cartCount = document.querySelector('[data-cartcount]');
                    if (parseInt(response.data.totalqty) > 0) {
                        cartCount.setAttribute('aria-hidden', false);
                        cartCount.innerText = response.data.totalqty;
                    } else {
                        cartCount.setAttribute('aria-hidden', true);
                        cartCount.innerText = '';
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
        })
    }

    /**
     *
     */
    init() {
        let obj = this;

        obj.qtyEl = item.querySelector('[' + obj.getMyAttrName('-item-qty') + ']');
        obj.decEl = item.querySelector('[' + obj.getMyAttrName('-item-dec') + ']');
        obj.incEl = item.querySelector('[' + obj.getMyAttrName('-item-inc') + ']');
        obj.stashEl = item.querySelector('[' + obj.getMyAttrName('-item-stash') + ']');
        obj.delEl = item.querySelector('[' + obj.getMyAttrName('-item-del') + ']');

        obj.initDecrement(item, id);
        obj.initIncrement(item, id);
        obj.initStash(item, id);
        obj.initDelete(item, id);
    }

    /**
     *
     */
    initDecrement(item, id) {
        let obj = this;



        let qty = qtyEl.getAttribute(obj.getMyAttrName('-item-qty'));
        if (!func.isInt(qty)) {
            decEl.disabled = true;
            return;
        }

        if (qty <= 1) {
            decEl.disabled = true;
        }

        decEl.addEventListener('click', function(e) {
            e.preventDefault();

            if (obj.processing) {
                return;
            }

            obj.setProcessing();

            let formData = new FormData;
            formData.append('product_id', id);

            obj.dispatcher.post(AppUrl.url(obj.actions.cart.decrease), formData)
                .then(function(response) { // success
                    obj.clearErrors();

                    // obj.qtyInput.value = response.data.qty;
                    if (response.data.qty > 0) {
                        obj.sendButton.setAttribute('aria-hidden', true);
                        obj.viewcartButton.setAttribute('aria-hidden', false);
                    } else {
                        obj.sendButton.setAttribute('aria-hidden', false);
                        obj.viewcartButton.setAttribute('aria-hidden', true);
                    }

                    let cartCount = document.querySelector('[data-cartcount]');
                    if (parseInt(response.data.totalqty) > 0) {
                        cartCount.setAttribute('aria-hidden', false);
                        cartCount.innerText = response.data.totalqty;
                    } else {
                        cartCount.setAttribute('aria-hidden', true);
                        cartCount.innerText = '';
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
        })
    }

    /**
     *
     */
    initIncrement(item) {
        let obj = this;

    }

    /**
     *
     */
    initStash(item) {
        let obj = this;

    }

    /**
     *
     */
    initDelete(item) {
        let obj = this;

    }

    /**
     *
     */
    isProcessing() {
        return this.processing;
    }

    /**
     *
     */
    setProcessing() {
        let obj = this;
        obj.processing = true;
    }

    /**
     *
     */
    releaseProcessing() {
        let obj = this;
        obj.processing = false;
    }

    /**
     *
     */
    getMyAttrName(additional = '') {
        return this.myAttrName + additional;
    }

    /**
     *
     */
    showErrors(errors) {
        let obj = this,
            control, errContainer, errMessageEl;

        obj.clearErrors();

        let index = 0;
        for (const [name, messages] of Object.entries(errors)) {
            control = obj.element.querySelector('[name="' + name + '"]');
            if (!control) {
                control = obj.element.querySelector('[data-altname="' + name + '"]');
            }

            if (control) {
                errContainer = control.closest('[data-errctr]');
                if (! errContainer) {
                    errContainer = control.parentNode;
                }

                func.addClass(errContainer, '-error');

                let id = obj.getMyAttrName() + '_' + name + '_' + obj.productId;
                errMessageEl = document.createElement('span');
                errMessageEl.id = id;
                errMessageEl.setAttribute('data-errmsg', '');
                func.addClass(errMessageEl, 'ap-edit-error');
                errMessageEl.textContent = messages[0];

                errContainer.appendChild(errMessageEl);

                control.setAttribute('aria-invalid', true);
                control.setAttribute('aria-errormessage', id);

                index++;
            }
        }
    }

    /**
     *
     */
    clearErrors() {
        let obj = this, elements;

        elements = obj.element.querySelectorAll('[data-errmsg], [data-errmsg-all]');
        for (var i = 0; i < elements.length; i++) {
            let target = obj.element.querySelector('[aria-errormessage="' + elements[i].id + '"]');
            if (target) {
                target.setAttribute('aria-invalid', false);
                target.removeAttribute('aria-errormessage');
            }
            elements[i].remove();
        }

        elements = obj.element.querySelectorAll('[data-errctr]');
        for (var i = 0; i < elements.length; i++) {
            func.removeClass(elements[i], '-error');
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