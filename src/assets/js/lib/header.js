import * as func from '../helpers/functions';

class Header {
    static targetAttrName = 'data-header';

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

        let headerContainer = document.querySelector('[' + obj.getMyAttrName('-holder') + ']');
        // 高さ取得
        let headerheight = obj.element.offsetHeight;
        // 取得した高さを代入
        headerContainer.style.height = headerheight + 'px';

        let position, offsetToShow;
        position = func.getElementPostion(obj.element);
        offsetToShow = position.y;

        let process = true;
        window.addEventListener('scroll', function() {
            let scrollOffset = func.getScrollOffset();
            let top = scrollOffset.top;
            if (top > offsetToShow) {
                if (!func.hasClass(obj.element, '-active')) {
                    func.addClass(obj.element, '-active');
                }
            } else {
                func.removeClass(obj.element, '-active');
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
        let attrName, element;

        attrName = Header.targetAttrName;
        element = document.querySelector('[' + attrName + ']');
        if (element) {
            new Header(element);
        }
    }
}

export default Header;