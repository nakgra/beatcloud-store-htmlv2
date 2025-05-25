import * as func from '../helpers/functions';
import messages from '../messages.js';

class Faq {
    static targetAttrName = 'data-faq';

    #element //本体
    #myAttrName //属性名

    #question;
    // #answer;
    #indicator;

    constructor(element, targetAttrName = null) {
        let obj = this;

        obj.element = element;
        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;

        obj.question = element.querySelector('[' + obj.getMyAttrName('-q') + ']');
        // obj.answer = element.querySelector('[' + obj.getMyAttrName('-a') + ']');
        obj.indicator = element.querySelector('[' + obj.getMyAttrName('-indicator') + ']');

        // 識別子
        obj.message = messages['faq']['open'];
        if (! obj.message) {
            return;
        }

        obj.question.addEventListener('click', function(e) {
            obj.toggle();
        });

        if (func.hasClass(obj.element, '-active')) {
            obj.indicator.innerText = messages['faq']['close'];
        } else {
            obj.indicator.innerText = messages['faq']['open'];
        }
    }

    toggle() {
        let obj = this;

        if (func.hasClass(obj.element, '-active')) {
            func.removeClass(obj.element, '-active');
            obj.indicator.innerText = messages['faq']['open'];
        } else {
            func.addClass(obj.element, '-active');
            obj.indicator.innerText = messages['faq']['close'];
        }
    }

    getMyAttrName(additional = '') {
        return this.myAttrName + additional;
    }

    static setup() {
        let attrName, elements;

        attrName = Faq.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        for (var i = 0; i < elements.length; i++) {
            new Faq(elements[i]);
        }
    }
}

export default Faq;