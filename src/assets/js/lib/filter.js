import * as func from '../helpers/functions';
import $ from 'jquery';

class Filter {
    static targetAttrName = 'data-filter';

    #element;
    #menu;
    #trigger;
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

        obj.trigger  = document.querySelector('[' + obj.getMyAttrName('-button') + ']');
        if (!obj.trigger) {
            console.log('test');
            return;
        }

        obj.trigger.addEventListener('click', function(e) {
            e.cancelBubble = true;
            obj.open();
        });


        //空クリック時に閉じる
        document.body.addEventListener('click', obj.close.bind(obj));
        // document.body.addEventListener('touchend', obj.close.bind(obj));

        // メニューはクリックイベントの伝播を抑止して、メニューを閉じてしまわないようにする
        // obj.element.addEventListener('click', (e) => {e.cancelBubble = true;});
        // obj.element.addEventListener('touchend', (e) => {e.cancelBubble = true;});

        $(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
            // newSize is the name of the now-current breakpoint, oldSize is the previous breakpoint
            if (Foundation.MediaQuery.is('large up')) {
                if (obj.isOpen()) {
                    obj.close();
                }
            }
        });
    }

    /**
     *
     **/
    isOpen() {
        let obj = this;

        return func.hasClass(obj.element, '-active');
    }

    /**
     *
     **/
    open() {
        let obj = this;

        document.body.style.top = `-${window.scrollY}px`;
        func.addClass(obj.element, '-active');
        func.addClass(document.documentElement, '-overlay');
    }

    /**
     *
     **/
    close() {
        let obj = this;
        const scrollY = document.body.style.top;

        func.removeClass(obj.element, '-active');
        func.removeClass(document.documentElement, '-overlay');
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
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

        attrName = Filter.targetAttrName;
        element = document.querySelector('[' + attrName + ']');
        if (element) {
            new Filter(element);
        }
    }
}

export default Filter;