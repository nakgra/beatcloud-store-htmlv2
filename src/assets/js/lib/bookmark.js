import * as func from '../helpers/functions';
import AppUrl from '../helpers/appUrl';
import dispatcher from '../helpers/dispatcher';
import config from '../config.js';
import components from '../components.js';
import messages from '../messages.js';

class Bookmark {
    static targetAttrName = 'data-bookmark';

    #element //本体
    #myAttrName //属性名
    #labelEl; // ラベル
    #dispatcher; // ajax

    #productId;
    #sendButton;
    #viewcartButton;

    #processing;

    constructor(element, targetAttrName = null) {
        let obj = this;

        obj.element = element;
        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;
        obj.dispatcher = dispatcher();

        obj.productId = obj.element.getAttribute(obj.getMyAttrName());
        obj.labelEl = obj.element.querySelector('[' + obj.getMyAttrName('-label') + ']');

        if (!obj.productId || !obj.labelEl) {
            return;
        }

        obj.element.addEventListener('click', function(e) {
            e.preventDefault();

            if (obj.processing) {
                return;
            }

            obj.setProcessing();

            let bookmarked = obj.element.hasAttribute(obj.getMyAttrName('-done'));
            let formData = new FormData;
            formData.append('product_id', obj.productId);
            formData.append('flg', bookmarked ? 0 : 1);

            obj.dispatcher.post(AppUrl.url(config.actions.bookmark.add), formData)
                .then(function(response) { // success
                    obj.clearErrors();

                    if (response.data.result) {
                        obj.element.setAttribute(obj.getMyAttrName('-done'), '');
                        obj.labelEl.innerText = messages.bookmark.done;
                    } else {
                        obj.element.removeAttribute(obj.getMyAttrName('-done'));
                        obj.labelEl.innerText = messages.bookmark.default;
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

    isProcessing() {
        return this.processing;
    }

    setProcessing() {
        let obj = this;

        if (obj.element.disabled !== 'undefined') {
            obj.element.disabled = true;
        }
        obj.element.setAttribute('aria-disabled', true);
        obj.processing = true;
    }

    releaseProcessing() {
        let obj = this;
        if (obj.element.disabled !== 'undefined') {
            obj.element.disabled = false;
        }
        obj.element.setAttribute('aria-disabled', false);
        obj.processing = false;
    }

    getMyAttrName(additional = '') {
        return this.myAttrName + additional;
    }

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

    static setup() {
        let attrName, elements;

        attrName = Bookmark.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        for (var i = 0; i < elements.length; i++) {
            new Bookmark(elements[i]);
        }
    }
}

export default Bookmark;