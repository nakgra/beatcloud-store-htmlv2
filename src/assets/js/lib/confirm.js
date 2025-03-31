import messages from '../messages.js';

class Confirm {
    static targetAttrName = 'data-confirm';

    #element //本体
    #myAttrName //属性名
    #message; // メッセージ

    constructor(element, targetAttrName = null) {
        let obj = this;

        obj.element = element;
        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;

        // 識別子
        obj.message = messages['confirm'][obj.element.getAttribute(obj.getMyAttrName())];
        if (! obj.message) {
            return;
        }

        element.addEventListener('click', function(e) {
            // e.preventDefault();
            if (!confirm(obj.message)) {
                e.preventDefault();
            }
        })
    }

    getMyAttrName(additional = '') {
        return this.myAttrName + additional;
    }

    static setup() {
        let attrName, elements;

        attrName = Confirm.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        for (var i = 0; i < elements.length; i++) {
            new Confirm(elements[i]);
        }
    }
}

export default Confirm;