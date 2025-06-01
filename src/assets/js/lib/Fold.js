import * as func from '../helpers/functions';
import messages from '../messages.js';

class Fold {
    static targetAttrName = 'data-fold';

    #element //本体
    #myAttrName //属性名
    #message; // メッセージ

    constructor(element, targetAttrName = null) {
        let obj = this;

        obj.element = element;
        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;

        obj.items = document.querySelectorAll('[' + obj.getMyAttrName('-item') + ']');

        obj.element.addEventListener('click', function(e) {
            e.preventDefault();
            let attrName = obj.getMyAttrName();

            let flg = func.toBoolean(this.getAttribute(attrName));
            for (var i = 0; i < obj.items.length; i++) {
                obj.items[i].setAttribute('aria-hidden', !flg);
            }
            this.setAttribute(attrName, !flg)

            if (flg) {
                obj.element.innerText = messages.fold.less;
            } else {
                obj.element.innerText = messages.fold.full;
            }
        });

        // init
        obj.element.setAttribute(obj.getMyAttrName(), true);
        obj.element.innerText = messages.fold.full;
        for (var i = 0; i < obj.items.length; i++) {
            obj.items[i].setAttribute('aria-hidden', true);
        }
    }

    getMyAttrName(additional = '') {
        return this.myAttrName + additional;
    }

    static setup() {
        let attrName, elements;

        attrName = Fold.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        for (var i = 0; i < elements.length; i++) {
            new Fold(elements[i]);
        }
    }
}

export default Fold;