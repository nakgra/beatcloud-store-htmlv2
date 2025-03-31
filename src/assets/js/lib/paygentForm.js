// import '@babel/polyfill'
import * as func from '../helpers/functions';
import messages from '../messages.js';
import Payment from 'payment';

var PaygentForm = function(form) {
    this.form = form;
    this.active = false;
    this.processing = false;
    this.ccName = null;
    this.ccNumber = null;
    this.ccExpiryM = null;
    this.ccExpiryY = null;
    this.ccCvc = null;
    this.init()
};

PaygentForm.prototype = {
    init: function() {
        let obj = this,
            cardPaymentCheck, fieldset, submitButton, ccNumber, ccExpiry, ccCvc;

        cardPaymentCheck = obj.form.querySelector('[data-checkout-card]');
        fieldset = obj.form.querySelector('[data-cc-fieldset]');
        if (!cardPaymentCheck || !fieldset) {
            return;
        }

        obj.activate(cardPaymentCheck.checked);
        // cardPaymentCheck.addEventListener('change', function(e) {
        //   obj.activate(this.checked);
        // });

        obj.ccName = obj.form.querySelector('[data-cc-name]');
        obj.ccNumber = obj.form.querySelector('[data-cc-number]');
        obj.ccExpiryM = obj.form.querySelector('[data-cc-expiry-m]');
        obj.ccExpiryY = obj.form.querySelector('[data-cc-expiry-y]');
        obj.ccCvc = obj.form.querySelector('[data-cc-cvc]');

        // Payment.formatCardExpiry(obj.ccExpiry);
        // obj.ccExpiry.addEventListener('blur', function() {
        //   if (!Payment.fns.validateCardExpiry(this.value)) {
        //   }
        // });

        Payment.formatCardNumber(obj.ccNumber);
        Payment.formatCardCVC(obj.ccCvc);
    },

    activate: function(isActive) {
        let obj = this,
            fieldset;

        // fieldset = obj.form.querySelector('[data-cc-fieldset]');
        if (isActive) {
            obj.active = true;
            // func.addClass(fieldset, 'active');
        } else {
            obj.active = false;
            // func.removeClass(fieldset, 'active');
        }
    },

    submit: function(submitButton) {
        let obj = this;

        if (obj.active && !obj.processing) {
            obj.processing = true;

            obj.clearError();
            if (obj.validateAndShowError()) {
                // obj.showMessage();
                obj.getToken();
                // obj.closeMessage();
            }

            obj.processing = false;
            submitButton.disabled = false;
        }
    },

    getToken: function() {
        let obj = this;

        obj.showMessage();

        let merchId, genKey;
        merchId = obj.form.querySelector('[data-cc-pgid]');
        genKey = obj.form.querySelector('[data-cc-pgkey]');

        let paygentToken = new PaygentToken();
        paygentToken.createToken(
            merchId.value,
            genKey.value, {
                card_number: obj.ccNumber.value.replaceAll(/\s/ig, ''),
                expire_year: obj.ccExpiryY.value,
                expire_month: obj.ccExpiryM.value,
                cvc: obj.ccCvc.value.replaceAll(/\s/ig, ''),
                name: obj.ccName.value.trim()
            },
            obj.processPurchase.bind(this)
        );

        obj.closeMessage();
    },

    validateAndShowError: function() {
        let obj = this,
            result = true;

        if (obj.isEmpty(obj.ccNumber.value)) {
            obj.showError(obj.ccNumber, messages.validation.required);
            result = false;
        }

        if (obj.isEmpty(obj.ccExpiryY.value) || obj.isEmpty(obj.ccExpiryM.value)) {
            obj.showError(obj.ccExpiryY, messages.validation.required);
            result = false;
        }

        if (obj.isEmpty(obj.ccCvc.value)) {
            obj.showError(obj.ccCvc, messages.validation.required);
            result = false;
        }

        if (obj.isEmpty(obj.ccName.value)) {
            obj.showError(obj.ccName, messages.validation.required);
            result = false;
        }

        let paymentSection = obj.form.querySelector('[data-step="payment"]');
        if (paymentSection) {
            var position = func.getElementPosition(paymentSection);
            func.skroll(position.top, 100);
        }

        return result;
    },

    showError: function(element, message) {
        let error, container;

        error = document.createElement('span');
        error.appendChild(document.createTextNode(message));
        error.className = 'ap-cc__error';
        error.setAttribute('data-cc-error', '');

        container = element.closest('[data-cc-inputcontainer]');
        if (!container) {
            container = element.parentNode;
        }
        container.appendChild(error);
    },

    clearError: function() {
        let obj = this,
            errors;

        errors = obj.form.querySelectorAll('[data-cc-error]');
        Array.prototype.forEach.call(errors, function(error) {
            error.parentNode.removeChild(error);
        })
    },

    processPurchase: function(response) {
        let obj = this;

        if (response.result == '0000') {
            obj.ccNumber.removeAttribute('name');
            obj.ccExpiryY.removeAttribute('name');
            obj.ccExpiryM.removeAttribute('name');
            obj.ccCvc.removeAttribute('name');
            obj.ccName.removeAttribute('name');

            let formToken, formNumber, formValidUntil, formFingerprint, formHash;

            formToken = obj.form.querySelector('[data-cc-send-token]');
            formNumber = obj.form.querySelector('[data-cc-send-number]');
            formValidUntil = obj.form.querySelector('[data-cc-send-validuntil]');
            formFingerprint = obj.form.querySelector('[data-cc-send-fp]');
            formHash = obj.form.querySelector('[data-cc-send-hc]');

            formToken.value = response.tokenizedCardObject.token;
            formNumber.value = response.tokenizedCardObject.masked_card_number;
            formValidUntil.value = response.tokenizedCardObject.valid_until;
            formFingerprint.value = response.tokenizedCardObject.fingerprint;
            formHash.value = response.hc;

            obj.form.submit();
            return;
        }

        // error handling
        switch (response.result) {
            case '1300':
            case '1301':
                obj.showError(obj.ccNumber, messages.validation.invalidNumber);
                break;
            case '1400':
            case '1401':
                obj.showError(obj.ccExpiryY, messages.validation.invalidExpiry);
                break;
            case '1500':
            case '1501':
            case '1502':
                obj.showError(obj.ccExpiryM, messages.validation.invalidExpiry);
                break;
            case '1600':
            case '1601':
                obj.showError(obj.ccCvc, messages.validation.invalidCvc);
                break;
            case '1700':
                obj.showError(obj.ccName, messages.validation.invalidName);
                break;
            case '7000':
                alert(messages.validation.incompatible);
                break;
            case '7001':
                alert(messages.validation.network);
                break;
            case '8000':
                alert(messages.validation.maintainance);
                break;
            case '9000':
            default:
                alert(messages.validation.error);
                break;
        }
    },

    showMessage: function() {
        let obj = this;
        //   rvElement, rv;

        // rvElement = document.querySelector('.reveal');
        // if (!rvElement) {
        //   rvElement = document.createElement('div');
        //   rvElement.className = 'reveal ap-cc__message';
        //   rvElement.setAttribute('data-reveal', '');

        //   // let message = document.createElement('span');
        //   rvElement.appendChild(document.createTextNode(messages.paymentprocessing));
        //   // document.body.appendChild(rvElement);

        //   rv = new Foundation.Reveal($(rvElement), {
        //     closeOnClick: false,
        //     closeOnEsc: false
        //   });
        // }

        // func.addClass(document.documentElement, 'is-checkoutOverlay');
        // $(rvElement).foundation('open');

        let submitButton = obj.form.querySelector('[data-checkout-submit]');
        submitButton.setAttribute('data-checkout-submit-stash', submitButton.value);
        submitButton.value = messages.paymentprocessing;
    },

    closeMessage: function() {
        let obj = this;

        // let rvElement = document.querySelector('.reveal');
        // if (rvElement) {
        //   $(rvElement).foundation('close');
        // }

        let submitButton = obj.form.querySelector('[data-checkout-submit]');
        submitButton.getAttribute('data-checkout-submit-stash');
        submitButton.value = submitButton.getAttribute('data-checkout-submit-stash');
        submitButton.setAttribute('data-checkout-submit-stash', '');
    },

    isEmpty: function(str) {
        return !str.trim().length;
    }
};

export default PaygentForm;