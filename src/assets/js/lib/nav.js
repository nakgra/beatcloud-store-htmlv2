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
            e.stopPropagation();

            obj.closeOthers();
            obj.toggle();
        });
        // obj.trigger.addEventListener('touchend', function(e) {
        //     e.stopPropagation();
        //     // obj.toggle();
        // });


        //空クリック時に閉じる
        document.body.addEventListener('click', obj.close.bind(obj));
        // document.body.addEventListener('touchend', obj.close.bind(obj));

        // サブメニューはクリックイベントの伝播を抑止して、メニューを閉じてしまわないようにする
        obj.menu.addEventListener('click', (e) => {e.stopPropagation();});
        // obj.menu.addEventListener('touchend', (e) => {e.stopPropagation();});

        $(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
            // newSize is the name of the now-current breakpoint, oldSize is the previous breakpoint
            obj.close();
        });

        obj.menu.addEventListener('closeRequested', function(e) {
            obj.close();
        });
    }

    /**
     *
     **/
    toggle() {
        let obj = this;

        if (obj.menu.hasAttribute('data-opened')) {
            obj.close();
        } else {
            obj.menu.setAttribute('data-opened', '');
            obj.trigger.setAttribute('data-opened', '');
        }
    }

    /**
     *
     **/
    close() {
        let obj = this;

        obj.trigger.removeAttribute('data-opened');
        obj.menu.removeAttribute('data-opened');
    }

    /**
     *
     **/
    closeOthers() {
        let obj = this;
        let event = new Event('closeRequested')
        let others = document.querySelectorAll('[data-opened]');
        Array.prototype.forEach.call(others, function(other) {
            if (other != obj.menu) {
                other.dispatchEvent(event);
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

        attrName = Nav.targetAttrName;
        element = document.querySelector('[' + attrName + ']');
        if (element) {
            new Nav(element);
        }
    }
}

export default Nav;