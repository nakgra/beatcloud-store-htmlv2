import * as func from '../helpers/functions';
import messages from '../messages.js';

class CopyText {
    static targetAttrName = 'data-copy';

    #element //本体
    #myAttrName //属性名
    #baseClassName // クラス名
    #name


    constructor(element, targetAttrName = null) {
        let obj = this;

        obj.element = element;
        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;

        obj.baseClassName = 'ap-copytext';
        obj.init();
    }

    /**
     *
     **/
    init() {
        let obj = this, targetEl, iconEl;

        if (!obj.element.firstChild) {
            return;
        }

        obj.name = obj.element.getAttribute(obj.getMyAttrName());

        func.addClass(obj.element, obj.getClassName(''));

        if (obj.element.tagName.toLowerCase() == 'a') {
            // aタグだった場合は、子要素をaタグに移して親を差し替える
            targetEl = obj.createTargetAsAnchor(obj.element);
            let newItemEl = obj.createItem(obj.element);
            obj.element.replaceWith(newItemEl);
            obj.element = newItemEl;
            obj.element.appendChild(targetEl);
        } else {
            // コピー対象にクラス追加
            targetEl = obj.createTarget(obj.element);
            obj.element.firstChild.replaceWith(targetEl);
        }

        if (obj.name) {
            iconEl = document.querySelector('[' + obj.getMyAttrName('-icon') + '="' + obj.name + '"]');
        }

        if (!iconEl) {
            // コピー対象の前にアイコンを挿入
            iconEl = obj.creatIcon();
            obj.element.appendChild(iconEl);
        }

        // クリックイベント
        iconEl.addEventListener('click', function(e) {
            e.preventDefault();

            let selection, range, targetEl;

            // ターゲットを取得
            if (obj.name) {
                targetEl = document.querySelector('[' + obj.getMyAttrName('-target') + '="' + obj.name + '"]');
            } else {
                targetEl = obj.element.querySelector('[' + obj.getMyAttrName('-target') + ']');
            }

            if (!targetEl) {
                targetEl = this.previousSibling;
            }

            if (obj.element.hasAttribute(obj.getMyAttrName('-multiline'))) {
                const mySmartTextarea = document.createElement('textarea');
                mySmartTextarea.innerHTML = targetEl.innerText;
                document.body.appendChild(mySmartTextarea);
                mySmartTextarea.select();
                document.execCommand('copy');
                mySmartTextarea.remove();
            } else {
                // 範囲選択クリア
                selection = window.getSelection();
                selection.removeAllRanges();

                // コピー対象を範囲選択
                range = document.createRange();
                range.selectNodeContents(targetEl);
                selection.addRange(range);

                // クリップボードにコピー
                document.execCommand('copy');

                // コピー対象の範囲選択クリア
                selection.removeAllRanges();
            }

            // アイコン制御
            obj.changeIcon(e.target);
            setTimeout(function() {
                obj.changeIcon(e.target);
            }, 1000);
        });
    }

    /**
     * ツールチップのステータスを変更
     */
    changeIcon(icon) {
        let obj = this;

        if (func.hasClass(icon, '-copied')) {
            func.removeClass(icon, '-copied');
        } else {
            func.addClass(icon, '-copied');
        }
    }

    /**
     * 差し替え用コンテナを生成
     */
    createItem(original) {
        let obj = this,
            el;

        el = document.createElement('span');
        func.copyAttributes(original, el, ['href']);
        return el;
    }

    /**
     * コピー対象テキストを複製
     */
    createTargetAsAnchor(item) {
        let obj = this,
            el;

        el = document.createElement('a');
        func.copyAttributes(item, el, [obj.getMyAttrName()]);
        func.removeClass(el, obj.baseClassName);
        var classList = el.classList;
        if (classList) {
            Array.prototype.forEach.call(classList, function(classItem) {
                func.removeClass(el, classItem);
            });
        }

        el.appendChild(document.createTextNode(item.firstChild.nodeValue));

        return el;
    }

    /**
     * コピー対象テキストを生成
     */
    createTarget(item) {
        let obj = this,
            targetEl;

        targetEl = document.createElement('span');
        targetEl.appendChild(document.createTextNode(item.firstChild.nodeValue));
        targetEl.className = obj.getClassName('__target');

        return targetEl;
    }

    /**
     * コピー用アイコンを生成
     */
    creatIcon() {
        let obj = this,
            iconEl;

        iconEl = document.createElement('span');
        iconEl.setAttribute(obj.getMyAttrName('-icon'), '');
        iconEl.className = obj.getClassName('__icon');
        // iconEl.appendChild(document.createTextNode('コピー'));

        return iconEl;
    }

    /**
     * css用クラスを返す
     */
    getClassName(additional = '') {
        let obj = this;
        return obj.baseClassName + additional;
    }

    // methods

    getMyAttrName(additional = '') {
        return this.myAttrName + additional;
    }

    static setup(target = null) {
        if (target) {
            let element = target.querySelector('[' + CopyText.targetAttrName + ']');
            if (element) {
                new CopyText(element);
            }
            return;
        }

        let elements = document.querySelectorAll('[' + CopyText.targetAttrName + ']');
        for (var i = 0; i < elements.length; i++) {
            new CopyText(elements[i]);
        }
    }
}

export default CopyText;