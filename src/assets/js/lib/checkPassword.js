import * as func from '../helpers/functions';

class CheckPassword {
    static targetAttrName = 'data-checkpassword';
    static cssClassActive = '-active';

    #element //本体
    #myAttrName //属性名
    #template; // テンプレート

    constructor(element, targetAttrName = null) {
        let obj = this;

        obj.element = element;
        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;
        obj.template = document.querySelector('[' + obj.getMyAttrName('-template') + ']');

        if (! obj.element.id) {
            obj.element.id = func.id();
        }

        let container,
            label,
            checkbox;

        // テンプレートからラベルとチェックボックスを生成
        label = obj.template.content.cloneNode(true);
        checkbox = label.querySelector('input[type=checkbox]');
        checkbox.setAttribute(obj.getMyAttrName('-target'), obj.element.id);

        // パスワード入力の親要素
        container = obj.element.parentNode;
        container.insertBefore(label, obj.element.nextSibling);

        // チェックでテキストとパスワードを差し替え
        checkbox.addEventListener('change', function() {
            let from = document.getElementById(this.getAttribute(obj.getMyAttrName('-target'))),
                to = document.createElement('input');

            to.type = this.checked ? 'text' : 'password';
            func.copyAttributes(from, to, ['type']);
            to.value = from.value;

            from.parentNode.replaceChild(to, from);
        });
    }

    getMyAttrName(additional = '') {
        return this.myAttrName + additional;
    }

    static setup() {
        let attrName, elements;

        attrName = CheckPassword.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        for (var i = 0; i < elements.length; i++) {
            new CheckPassword(elements[i]);
        }
    }
}

export default CheckPassword;