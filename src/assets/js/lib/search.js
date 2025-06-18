import * as func from '../helpers/functions';
import $ from 'jquery';

class Search {
    static targetAttrName = 'data-search';

    #element;
    #menu;
    #input;
    #trigger;
    #closebutton;
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
            return;
        }

        obj.input  = document.querySelector('[' + obj.getMyAttrName('-input') + ']');
        if (!obj.input) {
            return;
        }

        obj.trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            obj.closeOthers();
            obj.open();
        });

        obj.closebutton  = obj.element.querySelector('[' + obj.getMyAttrName('-close') + ']');
        if (obj.closebutton) {
            obj.closebutton.addEventListener('click', function(e) {
                e.preventDefault();
                // e.stopPropagation();
                obj.close();
            });
        }

        //空クリック時に閉じる
        document.body.addEventListener('click', obj.close.bind(obj));
        // document.body.addEventListener('touchend', obj.close.bind(obj));

        //esc
        document.body.addEventListener('keydown', function(e) {
            if (e.keyCode == 27 && obj.isOpen()) {
                obj.close();
            }
        });

        // メニューはクリックイベントの伝播を抑止して、メニューを閉じてしまわないようにする
        obj.element.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        // obj.element.addEventListener('touchend', (e) => {e.cancelBubble = true;});

        // $(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
        //     // newSize is the name of the now-current breakpoint, oldSize is the previous breakpoint
        //     if (Foundation.MediaQuery.is('large up')) {
        //         if (obj.isOpen()) {
        //             obj.close();
        //         }
        //     }
        // });

        obj.element.addEventListener('closeRequested', function(e) {
            obj.close();
        });
    }

    /**
     *
     **/
    isOpen() {
        let obj = this;

        return obj.element.hasAttribute('data-opened');
    }

    /**
     *
     **/
    open() {
        let obj = this;

        obj.element.setAttribute('data-opened', '');
        func.addClass(document.documentElement, '-overlay');

        obj.input.focus();
    }

    /**
     *
     **/
    close() {
        let obj = this;

        obj.element.removeAttribute('data-opened', '');
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
            if (other != obj.element) {
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

        attrName = Search.targetAttrName;
        element = document.querySelector('[' + attrName + ']');
        if (element) {
            new Search(element);
        }
    }
}

export default Search;