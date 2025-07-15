import * as func from '../helpers/functions';
import AppUrl from '../helpers/appUrl';
import dispatcher from '../helpers/dispatcher';
import config from '../config.js';
import components from '../components.js';
import messages from '../messages.js';

class AddCartButton {
    static targetAttrName = 'data-addcart';

    #element //本体
    #myAttrName //属性名
    #message; // メッセージ
    #dispatcher; // ajax

    #productId;
    #sendButton;
    #viewcartButton;

    #action;
    #processing;

    constructor(element, targetAttrName = null, options = {}) {
        let obj = this;

        obj.element = element;
        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;
        obj.dispatcher = dispatcher();

        obj.options = {
            onadded: function(button) {},
            onremoved: function(button) {},
        };
        obj.options = options = Object.assign(obj.options, options);

        obj.action = config.actions['addcart'];
        obj.productId = obj.element.getAttribute(obj.getMyAttrName());

        // obj.qtyInput = obj.element.querySelector('[data-qty]');
        obj.sendButton = obj.element.querySelector('[' + obj.getMyAttrName('-send') + ']');
        obj.viewcartButton = obj.element.querySelector('[' + obj.getMyAttrName('-view') + ']');

        if (!obj.productId || !obj.sendButton || !obj.viewcartButton) {
            return null;
        }

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
                        obj.setItemInCart()

                        // dispatch
                        obj.options.onadded(obj);
                    } else {
                        obj.setItemNotInCart();

                        // dispatch
                        obj.options.onremoved(obj);
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
     **/
    getId() {
        return this.productId;
    }

    /**
     *
     **/
    isProcessing() {
        return this.processing;
    }

    /**
     *
     **/
    setProcessing() {
        let obj = this;

        if (obj.sendButton.disabled !== 'undefined') {
            obj.sendButton.disabled = true;
        }
        obj.sendButton.setAttribute('aria-disabled', true);
        obj.processing = true;
    }

    /**
     *
     **/
    releaseProcessing() {
        let obj = this;
        if (obj.sendButton.disabled !== 'undefined') {
            obj.sendButton.disabled = false;
        }
        obj.sendButton.setAttribute('aria-disabled', false);
        obj.processing = false;
    }

    /**
     *
     **/
    setItemInCart() {
        let obj = this;

        obj.sendButton.setAttribute('aria-hidden', true);
        obj.viewcartButton.setAttribute('aria-hidden', false);
    }

    /**
     *
     **/
    setItemNotInCart() {
        let obj = this;

        obj.sendButton.setAttribute('aria-hidden', false);
        obj.viewcartButton.setAttribute('aria-hidden', true);
    }

    /**
     *
     **/
    getMyAttrName(additional = '') {
        return this.myAttrName + additional;
    }

    /**
     *
     **/
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
     **/
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
     **/
    static setup() {
        let attrName, elements;

        attrName = AddCartButton.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        for (var i = 0; i < elements.length; i++) {
            new AddCartButton(elements[i]);
        }
    }
}

export default AddCartButton;