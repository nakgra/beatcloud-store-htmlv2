"use strict";

/**/
export function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            document.attachEvent('onreadystatechange', function() {
                if (document.readyState != 'loading') {
                    fn();
                }
            });
        }
    }
}

/**/
export function hasClass(el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
    }
}

/**/
export function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), "");
    }
}

/**/
export function addClass(el, className) {
    if (hasClass(el, className)) {
        return;
    }

    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className = el.className + ' ' + className;
    }
};

/**/
export function toggleClass(el, className) {
    if (hasClass(el, className)) {
        removeClass(el, className);
    } else {
        addClass(el, className);
    }
};

/**/
export function removeChildren(el) {
    while (el.firstElementChild) {
        el.removeChild(el.firstElementChild);
    }
}

/*
get query string value
*/
export function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**/
export function getElementPostion(el) {
    var x = 0,
        y = 0;
    while (el != null) {
        x += el.offsetLeft;
        y += el.offsetTop;

        el = el.offsetParent;
    }

    return {
        x: x,
        y: y
    };
}

/*
copy all attributes
*/
export function copyAttributes(from, to, excludeAttr) {
    var excludeAttr = excludeAttr || [],
        attrs = from.attributes;

    for (var i = attrs.length - 1; i >= 0; i--) {
        if (excludeAttr.indexOf(attrs[i].name) > -1) {
            continue;
        }
        to.setAttribute(attrs[i].name, attrs[i].value);
        // to.value = from.value;
    }

    return to;
}

/**/
export function getScrollOffset() {
    var offsetLeft = 0,
        offsetTop = 0;

    if (document.documentElement.scrollTop) {
        offsetLeft = document.documentElement.scrollLeft;
        offsetTop = document.documentElement.scrollTop;
    } else if (document.body) {
        offsetLeft = document.body.scrollLeft;
        offsetTop = document.body.scrollTop;
    }

    return {
        left: offsetLeft,
        top: offsetTop
    };
};

/**/
export function getElementPosition(el) {
    var offset = getScrollOffset();
    var rect = el.getBoundingClientRect();

    return {
        left: offset.left + rect.left,
        top: offset.top + rect.top,
        bottom: offset.top + rect.top + rect.height
    };
}

/**/
export function getViewportHeight() {
    if (!window.innerHeight) {
        return document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
        // return {
        //   w: (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth),
        //   h: (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight)
        // };
    } else {
        return window.innerHeight;
        // return {
        //   w: window.innerWidth,
        //   h: window.innerHeight
        // };
    }
};

export function getDocumentHeight() {
    var b = document.body,
        de = document.documentElement;
    return Math.max(
        b.scrollHeight, de.scrollHeight,
        b.offsetHeight, de.offsetHeight,
        b.clientHeight, de.clientHeight
    );
};

export function skroll(to, duration) {
    var direction, scrollOffset, scrollTop;

    scrollOffset = getScrollOffset();
    scrollTop = scrollOffset.top;

    if (scrollTop == to) {
        return;
    } else if (scrollTop > to) {
        // scroll up
        direction = 'up';
    } else {
        // scroll down
        var maxScrollTop = getDocumentHeight() - getViewportHeight();
        if (maxScrollTop <= to) {
            to = maxScrollTop;
        }
        direction = 'down';
    }

    var distance, step, newDistance, interval, keepScrolling = true;

    distance = to - scrollTop;
    if (duration > 5) {
        step = distance / (duration / 5);
    } else {
        step = distance;
    }

    var scrollstep = function() {
        // body...
    };

    interval = setInterval(function() {

        newDistance = to - (scrollTop + step);
        if (
            (newDistance == 0) ||
            (direction == 'up' && newDistance > 0) ||
            (direction == 'down' && newDistance < 0)
        ) {
            keepScrolling = false
            scrollTop = to;
        } else {
            scrollTop = scrollTop + step;
        }

        window.scrollTo(0, scrollTop);
        if (!keepScrolling) {
            clearInterval(interval);
        }
    }, 5);
}

/**/
export function copyOwnPropertiesFrom(target, source) {
    Object.getOwnPropertyNames(source).forEach(function(propKey) {
        var desc = Object.getOwnPropertyDescriptor(source, propKey);
        Object.defineProperty(target, propKey, desc);
    });
}

/**/
export function subclasses(SubC, SuperC) {
    var subProto = Object.create(SuperC.prototype);
    copyOwnPropertiesFrom(subProto, SubC.prototype);
    SubC.prototype = subProto;
    SubC._super = SuperC.prototype;
}

/* https://gist.github.com/gordonbrander/2230317 */
export function id() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}

export function clearControl(formControl, dispatchEvent = true, eventMessage = null) {
    let eventType;

    switch (formControl.type) {
        case 'submit':
        case 'reset':
        case 'button':
        case 'image':
            return;
        case 'file':
            return;
        case 'hidden':
        case 'text':
        case 'password':
        case 'textarea':
            formControl.value = "";
            eventType = 'change';
            break;
        case 'checkbox':
        case 'radio':
            formControl.checked = false;
            eventType = 'change';
            break;
        case 'select-one':
        case 'select-multiple':
            formControl.selectedIndex = 0;
            eventType = 'input';
            break;
        default:
    }

    if (eventType && dispatchEvent) {
        let event = new CustomEvent(eventType, { detail: eventMessage });
        formControl.dispatchEvent(event);
    }
}

export function getValue(formControl) {
    switch (formControl.type) {
        case 'hidden':
        case 'submit':
        case 'text':
        case 'password':
        case 'textarea':
        case 'checkbox':
        case 'radio':
            return formControl.value;
            break;
        case 'select-one':
            return formControl.selectedOptions[0].value;
            break;
        case 'select-multiple':
            break;
        default:
    }
}

export function setValue(formControl, value, dispatchEvent = true, eventMessage = null) {
    let eventType;

    if (value == null) {
        value = '';
    }

    switch (formControl.type) {
        case 'submit':
        case 'reset':
        case 'button':
        case 'image':
            return;
        case 'file':
            return;
        case 'date':
        case 'email':
        case 'hidden':
        case 'month':
        case 'number':
        case 'password':
        case 'search':
        case 'tel':
        case 'text':
        case 'textarea':
        case 'time':
        case 'url':
        case 'week':
            formControl.value = value;
            eventType = 'change';
            break;
        case 'checkbox':
        case 'radio':
            if (formControl.value == value) {
                formControl.checked = true;
            } else {
                formControl.checked = false;
            }

            eventType = 'change';
            break;
        case 'select-one':
        case 'select-multiple':
            formControl.value = value;
            eventType = 'input';
            break;
        default:
    }

    if (eventType && dispatchEvent) {
        let event = new CustomEvent(eventType, { detail: eventMessage });
        formControl.dispatchEvent(event);
    }
}

export function disabled(control, disabled = true) {
    switch (control.tagName.toLowerCase()) {
        case 'button':
        case 'command':
        case 'fieldset':
        case 'input':
        case 'keygen':
        case 'optgroup':
        case 'option':
        case 'select':
        case 'textarea':
            control.disabled = disabled;
            break;
        default:
            if (disabled) {
                control.setAttribute('data-disabled', '');
            } else {
                control.removeAttribute('data-disabled');
            }
    }
}

export function isInt(value) {
    if (isNaN(value)) {
        return false;
    }

    let x = parseFloat(value);
    return (x | 0) === x;
}

/**
 *
 * await sleep(3000);
 **/
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}
