import * as func from '../helpers/functions';
import AppUrl from '../helpers/appUrl';
import dispatcher from '../helpers/dispatcher';
import config from '../config.js';
import components from '../components.js';
import messages from '../messages.js';

class Base {
    // static targetAttrName = '';

    #element //本体
    #myAttrName //属性名
    #message // メッセージ
    #dispatcher // ajax
    #processing

    /**
     *
     */
    constructor(element, targetAttrName = null) {
        let obj = this;

        obj.element = element;
        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;
        obj.dispatcher = dispatcher();

        obj.init();
    }

    /**
     *
     */
    init() {}
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
}

export default Base;
