import * as func from '../helpers/functions';
import $ from 'jquery';
import { Foundation } from 'foundation-sites/js/foundation.core';

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

        // ドロップダウン
        obj.children  = obj.menu.querySelectorAll('[' + obj.getMyAttrName('-menu-sub') + ']');
        Array.prototype.forEach.call(obj.children, function(child) {
            let name, button;
            name = child.getAttribute(obj.getMyAttrName('-menu-sub'));
            button  = obj.menu.querySelector('[' + obj.getMyAttrName('-menu-sub-button') + '="' + name + '"]');
            if (button) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();

                    if (Foundation.MediaQuery.atLeast('large')) {
                        return;
                    }

                    if (button.hasAttribute('data-opened')) {
                        button.removeAttribute('data-opened');
                        child.removeAttribute('data-opened');
                    } else {
                        button.setAttribute('data-opened', true);
                        child.setAttribute('data-opened', true);
                    }
                });
            }
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
            func.addClass(document.documentElement, '-overlay');
        }
    }

    /**
     *
     **/
    close() {
        let obj = this;

        obj.trigger.removeAttribute('data-opened');
        obj.menu.removeAttribute('data-opened');

        let chilren = obj.menu.querySelectorAll('[data-opened]');
        Array.prototype.forEach.call(chilren, function(child) {
            child.removeAttribute('data-opened');
        });

        func.removeClass(document.documentElement, '-overlay');
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