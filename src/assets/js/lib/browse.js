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

    #filterModal
    #filterModalBody
    #filterModalTrigger
    #filterModalCloseButton

    constructor(element, targetAttrName = null) {
        let obj = this;
        obj.element = element;
        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;

        obj.init();

    }

    init() {
        let obj = this;

        obj.headerNav = obj.element.querySelector('[' + obj.getMyAttrName('-nav') + ']');

        // フォーム要素の選択時に送信
        Array.prototype.forEach.call(obj.element.elements, function(formControl) {
            formControl.addEventListener('change', function(e) {
                if (Foundation.MediaQuery.atLeast('large')) {
                    obj.element.submit();
                }
            });
        });

        obj.initOrderby();

        obj.initFilterModal();

        obj.resize();
    }

    /**
     *
     **/
    initOrderby() {
        let obj = this;

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

    /**
     *
     **/
    initFilterModal() {
        let obj = this;

        //モーダル親
        obj.filterModal  = document.querySelector('[' + obj.getMyAttrName('-filter') + ']');

        // モーダル要素コンテナ
        obj.filterModalBody  = document.querySelector('[' + obj.getMyAttrName('-filter-container') + ']');

        // 絞り込みボタン
        obj.filterModalTrigger  = document.querySelector('[' + obj.getMyAttrName('-filter-button') + ']');
        if (!obj.filterModalTrigger) {
            return;
        }

        obj.filterModalTrigger.addEventListener('click', function(e) {
            e.stopPropagation();

            obj.closeOthers();
            obj.openModal();
        });

        // 検索ポップアップ閉じる
        obj.filterModalCloseButton  = document.querySelector('[' + obj.getMyAttrName('-filter-close') + ']');
        if (obj.filterModalCloseButton) {
            obj.filterModalCloseButton.addEventListener('click', function(e) {
                e.preventDefault();
                // e.stopPropagation();
                obj.closeModal();
            });
        }

        //escキー
        document.body.addEventListener('keydown', function(e) {
            if (e.keyCode == 27 && obj.isOpen()) {
                obj.close();
            }
        });

        //ウィンドウのリサイズ
        $(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
            // newSize is the name of the now-current breakpoint, oldSize is the previous breakpoint
            obj.resize();
        });

        // カスタムイベント
        obj.filterModal.addEventListener('closeRequested', function(e) {
            obj.closeModal();
        });
    }

    /**
     *
     **/
    resize() {
        let obj = this;

        if (Foundation.MediaQuery.is('large up')) {
            if (obj.isModalOpen()) {
                obj.closeModal();
            }

            obj.headerNav.appendChild(obj.orderByContainer);
            func.removeClass(obj.orderByContainer, '-filter');
        } else {
            func.removeClass(obj.orderByMenu, '-open');

            obj.filterModalBody.prepend(obj.orderByContainer);
            func.addClass(obj.orderByContainer, '-filter');
        }
    }

    /**
     *
     **/
    isModalOpen() {
        let obj = this;

        return obj.filterModal.hasAttribute('data-opened');
    }

    /**
     *
     **/
    openModal() {
        let obj = this;

        // document.body.style.top = `-${window.scrollY}px`;
        obj.filterModal.setAttribute('data-opened', '');
        func.addClass(document.documentElement, '-overlay');
    }

    /**
     *
     **/
    closeModal() {
        let obj = this;
        // const scrollY = document.body.style.top;

        obj.filterModal.removeAttribute('data-opened');
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
            if (other != obj.filterModal) {
                other.dispatchEvent(event);
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