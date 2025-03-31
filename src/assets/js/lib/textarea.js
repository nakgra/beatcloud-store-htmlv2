import * as func from '../helpers/functions';

class Textarea {
    static targetAttrName = 'data-textarea';

    #myAttrName;

    /**
     *
     **/
    constructor(element, targetAttrName = null) {
        this.element = element;
        this.myAttrName = targetAttrName ? targetAttrName : this.constructor.targetAttrName;
        this.init();
    }

    /**
     *
     **/
    init() {
        let obj = this;

        obj.resize();

        obj.element.addEventListener('input', function() {
            obj.resize();
        });

        obj.element.addEventListener('change', function(e) {
            if (!e.target.value) {
                obj.resize();
            }
        });

        obj.element.addEventListener('show', function() {
            obj.resize();
        });
    }

    /**
     *
     **/
    resize() {
        let obj = this;

        obj.element.style.height = 'auto';
        obj.element.style.height = this.element.scrollHeight + 'px';
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
    static setup() {
        let attrName, elements;

        attrName = Textarea.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        Array.prototype.forEach.call(elements, function(element) {
            new Textarea(element);
        });
    }
}

export default Textarea;