import * as func from '../helpers/functions';
import AppUrl from '../helpers/appUrl';
import config from '../config.js';
import PaygentForm from './paygentForm.js';

var CheckoutForm = function(element) {
    this.form = element;
    this.action = null;
    this.paymentForm = null;
    this.init();
};

CheckoutForm.prototype = {
    init: function() {
        let obj = this,
            updates;

        obj.action = obj.form.action;

        updates = obj.form.querySelectorAll('[data-checkout-update]');
        Array.prototype.forEach.call(updates, function(submit, i) {
            let type = submit.getAttribute('data-checkout-update');

            switch (type) {
                case 'button':
                    submit.addEventListener('click', function(e) {
                        e.preventDefault();

                        let stepInput = obj.form.querySelector('input[data-checkout-step]');
                        if (stepInput) {
                            stepInput.value = this.getAttribute('data-goto');
                        }
                        obj.form.action = obj.form.getAttribute('data-checkout');
                        obj.form.submit();
                    })
                    break;
                case 'radio':
                case 'checkbox':
                case 'select':
                    submit.addEventListener('change', function(e) {
                        e.preventDefault();

                        let stepInput = obj.form.querySelector('input[data-checkout-step]');
                        if (stepInput) {
                            stepInput.value = this.getAttribute('data-goto');
                        }
                        obj.form.action = obj.form.getAttribute('data-checkout');
                        obj.form.submit();
                    })
                    break;
            }
        });

        obj.paymentForm = new PaygentForm(obj.form);

        let submitButton = obj.form.querySelector('[data-checkout-submit]');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                this.disabled = true;

                if (obj.paymentForm.active) {
                    obj.paymentForm.submit(this);
                } else {
                    obj.form.submit();
                }
                // e.target.disabled = false;
            });
        }

        let stepInput, scrollto;
        stepInput = obj.form.querySelector('input[data-checkout-step]');
        if (stepInput && stepInput.value) {
            scrollto = obj.form.querySelector('[data-step="' + stepInput.value + '"]');
            if (scrollto) {
                var position = func.getElementPosition(scrollto);
                func.skroll(position.top, 100);
            }
            stepInput.value = '';
        }
    }
};

CheckoutForm.setup = function() {
    let element = document.querySelector('[data-checkout]');
    if (element) {
        return new CheckoutForm(element);
    }
};

export default CheckoutForm;