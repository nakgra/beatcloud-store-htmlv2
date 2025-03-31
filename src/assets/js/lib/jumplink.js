import * as func from '../helpers/functions';

class Jumplink {
    static targetAttrName = 'data-jump';

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

        obj.element.addEventListener('click', function(e) {
            e.preventDefault();

            if (this.hash == '') {
                // window.scrollTo(0, 0);
                func.skroll(0, 100);
                return;
            }

            let target = document.getElementById(this.hash.replace(/[\/#]/, ''));
            if (target) {
                let position = func.getElementPosition(target);
                func.skroll(position.top, 200);
                // window.scrollTo(position.left, position.top);
            }
        });
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

        attrName = Jumplink.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        Array.prototype.forEach.call(elements, function(element) {
            new Jumplink(element);
        });
    }
}

export default Jumplink;