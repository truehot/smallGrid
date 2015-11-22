(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Event": {
                "Data": EventData,
                "Handler": EventHandler
            }
        }
    });

    function EventData(data) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }

        var isPropagationStopped = false;
        var isImmediatePropagationStopped = false;

        this.preventDefault = function () {
            if (data && "event" in data && typeof (data.event.preventDefault) === "function") {
                data.event.preventDefault();
            }
        }

        this.stopPropagation = function () {
            if (data && "event" in data && typeof (data.event.stopPropagation) === "function") {
                data.event.stopPropagation();
            }
            isPropagationStopped = true;
        };

        this.isPropagationStopped = function () {
            return isPropagationStopped;
        };

        //Keeps the rest of the handlers from being executed
        this.stopImmediatePropagation = function () {
            if (data && "event" in data && typeof (data.event.stopImmediatePropagation) === "function") {
                data.event.stopImmediatePropagation();
            }
            isImmediatePropagationStopped = true;
        };

        this.isImmediatePropagationStopped = function () {
            return isImmediatePropagationStopped;
        };
    }

    function EventHandler() {
        var handlers = [];
        var self = this;

        this.subscribe = function (func) {
            handlers.push(func);
            return self;
        };

        this.unsubscribe = function (func) {
            for (var i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i] === func) {
                    handlers.splice(i, 1);
                }
            }
            return self;
        };

        this.unsubscribeLast = function () {
            if (handlers.length) {
                handlers.pop();
            }
            return self;
        };

        this.unsubscribeAll = function () {
            handlers = [];
            return self;
        };

        this.notify = function (eventData) {
            if (typeof (eventData) != EventData) {
                eventData = new EventData(eventData);
            }

            for (var i = 0; i < handlers.length && !eventData.isImmediatePropagationStopped() ; i++) {
                if (handlers[i].call(this, eventData) === false) {
                    this.stopImmediatePropagation();
                    break;
                }
            }
        };
    }

})(jQuery);