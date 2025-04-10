import * as func from '../helpers/functions';
import $ from 'jquery';

class Filter {
    static targetAttrName = 'data-filter';

    #element;
    #menu;
    #closebutton;
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
            return;
        }

        obj.trigger.addEventListener('click', function(e) {
            e.stopPropagation();

            obj.closeOthers();
            obj.open();
        });


        obj.closebutton  = document.querySelector('[' + obj.getMyAttrName('-close') + ']');
        if (obj.closebutton) {
            obj.closebutton.addEventListener('click', function(e) {
                e.preventDefault();
                // e.stopPropagation();
                obj.close();
            });
        }


        //空クリック時に閉じる
        // document.body.addEventListener('click', obj.close.bind(obj));
        // document.body.addEventListener('touchend', obj.close.bind(obj));

        // メニューはクリックイベントの伝播を抑止して、メニューを閉じてしまわないようにする
        // obj.element.addEventListener('click', (e) => {e.stopPropagation();});
        // obj.element.addEventListener('touchend', (e) => {e.stopPropagation();});

        //esc
        document.body.addEventListener('keydown', function(e) {
            if (e.keyCode == 27 && obj.isOpen()) {
                obj.close();
            }
        });

        $(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
            // newSize is the name of the now-current breakpoint, oldSize is the previous breakpoint
            if (Foundation.MediaQuery.is('large up')) {
                if (obj.isOpen()) {
                    obj.close();
                }
            }
        });

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

        // document.body.style.top = `-${window.scrollY}px`;
        obj.element.setAttribute('data-opened', '');
        func.addClass(document.documentElement, '-overlay');
    }

    /**
     *
     **/
    close() {
        let obj = this;
        // const scrollY = document.body.style.top;

        obj.element.removeAttribute('data-opened');
        func.removeClass(document.documentElement, '-overlay');
        // document.body.style.top = '';
        // window.scrollTo(0, parseInt(scrollY || '0') * -1);
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

        attrName = Filter.targetAttrName;
        element = document.querySelector('[' + attrName + ']');
        if (element) {
            new Filter(element);
        }
    }
}

export default Filter;