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
import CheckoutForm from './lib/checkoutForm';
import CheckPassword from './lib/checkPassword';
import Confirm from './lib/confirm';
import Jumplink from './lib/jumplink';
import Textarea from './lib/textarea';
import Header from './lib/header';
import Nav from './lib/nav';
import Carousel from './lib/carousel';

(function(window, document) {
    CheckoutForm.setup();
    CheckPassword.setup();
    Confirm.setup();
    Jumplink.setup();
    Textarea.setup();
    Header.setup();
    Nav.setup();
    Carousel.setup();
})(window, window.document);