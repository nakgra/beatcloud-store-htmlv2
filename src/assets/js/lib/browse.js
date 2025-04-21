import * as func from '../helpers/functions';
import $ from 'jquery';
import messages from '../messages.js';
import { Foundation } from 'foundation-sites/js/foundation.core';

class Browse {
    static targetAttrName = 'data-browse';

    #element //本体
    #myAttrName //属性名
    #message; // メッセージ

    #headerNav
    #orderByContainer
    #orderByButton
    #orderByMenu

    constructor(element, targetAttrName = null) {
        let obj = this;

        obj.element = element;
        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;

        obj.headerNav = obj.element.querySelector('[' + obj.getMyAttrName('-nav') + ']');

        Array.prototype.forEach.call(obj.element.elements, function(formControl) {
            formControl.addEventListener('change', function(e) {
                if (Foundation.MediaQuery.atLeast('large')) {
                    console.log('change', this.value);
                }
            });
        });

        // 並び順
        obj.orderByContainer = obj.element.querySelector('[' + obj.getMyAttrName('-orderby') + ']');
        obj.orderByButton = obj.orderByContainer.querySelector('[' + obj.getMyAttrName('-orderby-button') + ']');
        obj.orderByMenu = obj.orderByContainer.querySelector('[' + obj.getMyAttrName('-orderby-menu') + ']');

        obj.orderByButton.addEventListener('click', function(e) {
            if (Foundation.MediaQuery.atLeast('large')) {
                e.stopPropagation();
                e.preventDefault();
                func.toggleClass(obj.orderByMenu, '-open');
            }
        });

        //空クリック時に閉じる
        document.body.addEventListener('click', function() {
            if (Foundation.MediaQuery.atLeast('large')) {
                func.removeClass(obj.orderByMenu, '-open');
            }
        });

    }

    getMyAttrName(additional = '') {
        return this.myAttrName + additional;
    }

    static setup() {
        let attrName, element;

        attrName = Browse.targetAttrName;
        element = document.querySelector('[' + attrName + ']');
        if (element) {
            new Browse(element);
        }
    }
}

export default Browse;