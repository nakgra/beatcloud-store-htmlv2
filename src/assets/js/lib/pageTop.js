import * as func from '../helpers/functions';

class PageTop {
    static targetAttrName = 'data-pagetop';

    #element //本体
    #myAttrName //属性名


    constructor(element, targetAttrName = null) {
        let obj = this;

        obj.element = element;
        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;

        let offsetToShow = obj.element.dataset.pagetop;
        if (!offsetToShow || Number.isInteger(offsetToShow)) {
            offsetToShow = 50;
        } else {
            offsetToShow = parseInt(offsetToShow);
        }

        let process = true;
        window.addEventListener('scroll', function() {
            if (process) {
                process = false;
                setTimeout(function() {
                    let scrollOffset = func.getScrollOffset();

                    if (scrollOffset.top > offsetToShow) {
                        func.addClass(obj.element, '-active');
                    } else {
                        func.removeClass(obj.element, '-active');
                    }

                    process = true;
                }, 100);
            }
        });
    }

    getMyAttrName(additional = '') {
        return this.myAttrName + additional;
    }

    static setup() {
        let attrName, elements;

        attrName = PageTop.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        for (var i = 0; i < elements.length; i++) {
            new PageTop(elements[i]);
        }
    }
}

export default PageTop;