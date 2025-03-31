import $ from 'jquery';
import * as func from '../helpers/functions';
import 'slick-carousel'

class Carousel {
    static targetAttrName = 'data-carousel';

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

        $(obj.element).slick({
            autoplay: true,
            autoplaySpeed: 3000,
            arrows: true,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            speed: 3000
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
        let attrName, elements;

        attrName = Carousel.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        Array.prototype.forEach.call(elements, function(element) {
            new Carousel(element);
        });
    }
}

export default Carousel;