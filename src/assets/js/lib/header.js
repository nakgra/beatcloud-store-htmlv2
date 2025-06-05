import * as func from '../helpers/functions';
import $ from 'jquery';

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

        obj.headerContainer = document.querySelector('[' + obj.getMyAttrName('-holder') + ']');
        // 取得した高さを代入
        obj.headerContainer.style.height = obj.element.offsetHeight + 'px';

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

        //ウィンドウのリサイズ
        $(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
            // 取得した高さを代入
            obj.headerContainer.style.height = obj.element.offsetHeight + 'px';
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