import * as func from '../helpers/functions';

import $ from 'jquery';
window.jQuery = $;
require('../vendor/foundation-datepicker');

$.fn.fdatepicker.dates['ja'] = {
    days: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
    daysShort: ["日", "月", "火", "水", "木", "金", "土"],
    daysMin: ["日", "月", "火", "水", "木", "金", "土"],
    months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    monthsShort: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    today: "今日",
    format: "yyyy/mm/dd",
    titleFormat: "yyyy年 mm月"
};

class Datepicker {
    static targetAttrName = 'data-datepicker';

    #myAttrName;

    /**
     *
     **/
    constructor(element, options, targetAttrName = null) {
        this.element = element;
        this.myAttrName = targetAttrName ? targetAttrName : this.constructor.targetAttrName;

        this.options = {
            onchange: function(date) {}
        };
        this.options = options = Object.assign(this.options, options);

        this.init();
    }

    /**
     *
     **/
    init() {
        let obj = this;

        obj.element.setAttribute('autocomplete', 'off');

        obj.instance = $(obj.element).fdatepicker({
            language: 'ja',
            leftArrow: '<i class="datepicker__prev"></i>',
            rightArrow: '<i class="datepicker__next"></i>',
            closeButton: false
        }).on('changeDate', function(ev) {
            if (typeof ev.target.toggleActive == 'function') {
              obj.element.toggleActive();
            }

            obj.options.onchange(obj.element.value);
        });
    }

    /**
     *
     **/
    setStartDate(date) {
        let obj = this;
        $(obj.element).fdatepicker('setStartDate', date);
    }

    /**
     *
     **/
    setEndDate(date) {
        let obj = this;
        $(obj.element).fdatepicker('setEndDate', date);
    }

    /**
     *
     **/
    remove() {
        let obj = this;
        $(obj.element).fdatepicker('remove');
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

        attrName = Datepicker.targetAttrName;
        elements = document.querySelectorAll('[' + attrName + ']');
        Array.prototype.forEach.call(elements, function(element) {
            new Datepicker(element);
        });
    }
}

export default Datepicker;