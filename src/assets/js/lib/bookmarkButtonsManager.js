import * as func from '../helpers/functions';
import BookmarkButton from './bookmarkButton.js';

class BookmarkButtonsManager {
    static targetAttrName = 'data-bookmark';

    #buttons
    #myAttrName

    constructor(targetAttrName = null) {
        let obj = this;

        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;

        let elements;

        obj.buttons = {};
        elements = document.querySelectorAll('[' + obj.myAttrName + ']');
        for (var i = 0; i < elements.length; i++) {
            let button = new BookmarkButton(elements[i], obj.myAttrName, {
                onbookmarked: obj.onBookmarked.bind(obj),
                onunbookmarked: obj.onUnbookmarked.bind(obj)
            });

            if (button) {
                let productId = button.getId();
                if (productId in obj.buttons === false) {
                    obj.buttons[productId] = [];
                }

                obj.buttons[productId].push(button);
            }
        }
    }

    /**
     *
     **/
    onBookmarked(button) {
        let obj = this;

        if (button.getId() in obj.buttons) {
            let productId = button.getId();
            for (var i = 0; i < obj.buttons[productId].length; i++) {
                if (obj.buttons[productId][i] == button) {
                    continue;
                }

                obj.buttons[productId][i].clearErrors();
                obj.buttons[productId][i].setBookmarked();
            }
        }
    }

    /**
     *
     **/
    onUnbookmarked(button) {
        let obj = this;

        if (button.getId() in obj.buttons) {
            let productId = button.getId();
            for (var i = 0; i < obj.buttons[productId].length; i++) {
                if (obj.buttons[productId][i] == button) {
                    continue;
                }

                obj.buttons[productId][i].clearErrors();
                obj.buttons[productId][i].setUnbookmarked();
            }
        }
    }
}

export default BookmarkButtonsManager;