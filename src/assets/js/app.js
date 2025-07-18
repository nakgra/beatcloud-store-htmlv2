import $ from 'jquery';
import 'what-input';

// Foundation JS relies on a global variable. In ES6, all imports are hoisted
// to the top of the file so if we used `import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
window.jQuery = $;
require('foundation-sites');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
import './lib/foundation-explicit-pieces';


$(document).foundation();


import * as func from './helpers/functions';
import AddCartButtonsManager from './lib/addCartButtonsManager';
import BookmarkButtonsManager from './lib/bookmarkButtonsManager';
import Browse from './lib/browse';
import Carousel from './lib/carousel';
import Cart from './lib/cart';
import CartItem from './lib/cartItem';
import CheckoutForm from './lib/checkoutForm';
import CheckPassword from './lib/checkPassword';
import Confirm from './lib/confirm';
import CopyText from './lib/copyText';
import Datepicker from './lib/datepicker';
import Faq from './lib/faq';
import Fold from './lib/fold';
import Header from './lib/header';
import Jumplink from './lib/jumplink';
import Nav from './lib/nav';
import PageTop from './lib/pageTop';
import Search from './lib/Search';
import Stashed from './lib/stashed';
import Textarea from './lib/textarea';
import MyMenu from './lib/myMenu';


(function(window, document) {
    new AddCartButtonsManager();
    new BookmarkButtonsManager();
    Browse.setup();
    Carousel.setup();
    Cart.setup();
    CartItem.setup();
    CheckoutForm.setup();
    CheckPassword.setup();
    Confirm.setup();
    CopyText.setup();
    Datepicker.setup();
    Faq.setup();
    Fold.setup();
    Header.setup();
    Jumplink.setup();
    MyMenu.setup();
    Nav.setup();
    PageTop.setup();
    Search.setup();
    Stashed.setup();
    Textarea.setup();
})(window, window.document);