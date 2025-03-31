import * as func from '../helpers/functions';
import $ from 'jquery';

class Nav {
    static targetAttrName = 'data-nav';

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

        obj.menu  = obj.element.querySelector('[' + obj.getMyAttrName('-menu') + ']');
        if (!obj.menu) {
            return;
        }

        obj.trigger  = obj.element.querySelector('[' + obj.getMyAttrName('-button') + ']');
        if (!obj.trigger) {
            return;
        }

        obj.trigger.addEventListener('click', function(e) {
            e.cancelBubble = true;
            obj.toggle();
        });
        // obj.trigger.addEventListener('touchend', function(e) {
        //     e.cancelBubble = true;
        //     // obj.toggle();
        // });


        //空クリック時に閉じる
        document.body.addEventListener('click', obj.close.bind(obj));
        // document.body.addEventListener('touchend', obj.close.bind(obj));

        // サブメニューはクリックイベントの伝播を抑止して、メニューを閉じてしまわないようにする
        obj.menu.addEventListener('click', (e) => {e.cancelBubble = true;});
        // obj.menu.addEventListener('touchend', (e) => {e.cancelBubble = true;});

        $(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
            // newSize is the name of the now-current breakpoint, oldSize is the previous breakpoint
            obj.close();
        });
    }

    /**
     *
     **/
    toggle() {
        let obj = this;
        func.toggleClass(document.documentElement, '-overlay');

        if (func.hasClass(obj.menu, '-open')) {
            obj.close();
        } else {
            func.addClass(obj.menu, '-open');
            func.addClass(obj.trigger, '-open');
        }
    }

    /**
     *
     **/
    close() {
        let obj = this;
        func.removeClass(obj.trigger, '-open');
        func.removeClass(document.documentElement, '-overlay');
        func.removeClass(obj.menu, '-open');
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

        attrName = Nav.targetAttrName;
        element = document.querySelector('[' + attrName + ']');
        new Nav(element);
    }
}

export default Nav;