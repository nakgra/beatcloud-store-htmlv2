import * as func from '../helpers/functions';
import AddCartButton from './addCartButton.js';

class AddCartButtonsManager {
    static targetAttrName = 'data-addcart';

    #buttons
    #myAttrName

    constructor(targetAttrName = null) {
        let obj = this;

        obj.myAttrName = targetAttrName ? targetAttrName : obj.constructor.targetAttrName;

        let elements;

        obj.buttons = {};
        elements = document.querySelectorAll('[' + obj.myAttrName + ']');
        for (var i = 0; i < elements.length; i++) {
            let button = new AddCartButton(elements[i], obj.myAttrName, {
                onadded: obj.onAdded.bind(obj),
                onremoved: obj.onRemoved.bind(obj)
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
    onAdded(button) {
        let obj = this;

        if (button.getId() in obj.buttons) {
            let productId = button.getId();
            for (var i = 0; i < obj.buttons[productId].length; i++) {
                if (obj.buttons[productId][i] == button) {
                    continue;
                }

                obj.buttons[productId][i].clearErrors();
                obj.buttons[productId][i].setItemInCart();
            }
        }
    }

    /**
     *
     **/
    onRemoved(button) {
        let obj = this;

        if (button.getId() in obj.buttons) {
            let productId = button.getId();
            for (var i = 0; i < obj.buttons[productId].length; i++) {
                if (obj.buttons[productId][i] == button) {
                    continue;
                }

                obj.buttons[productId][i].clearErrors();
                obj.buttons[productId][i].setItemNotInCart();
            }
        }
    }
}

export default AddCartButtonsManager;