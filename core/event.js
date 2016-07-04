(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Event": {
            "Data": EventData,
            "Handler": EventHandler
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
        var isDefaultPrevented = false;

        this.preventDefault = function () {
            if (data && "event" in data && typeof data.event.preventDefault === "function") {
                data.event.preventDefault();
            }
            isDefaultPrevented = true;
        };

        this.isDefaultPrevented = function () {
            return isDefaultPrevented;
        };

        this.stopPropagation = function () {
            if (data && "event" in data && typeof data.event.stopPropagation === "function") {
                data.event.stopPropagation();
            }
            isPropagationStopped = true;
        };

        this.isPropagationStopped = function () {
            return isPropagationStopped;
        };

        //Keeps the rest of the handlers from being executed
        this.stopImmediatePropagation = function () {
            if (data && "event" in data && typeof data.event.stopImmediatePropagation === "function") {
                data.event.stopImmediatePropagation();
            }
            isImmediatePropagationStopped = true;
        };

        this.isImmediatePropagationStopped = function () {
            return isImmediatePropagationStopped;
        };
    }

    function EventHandler() {
        var self = this,
            handlers = [],
            blockEvents = false,
            blockedEventData = [];


        self.subscribe = function (func) {
            if ($.isFunction(func)) {
                handlers.push(func);
            }
            return self;
        };

        self.unsubscribe = function (func) {
            for (var i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i] === func) {
                    handlers.splice(i, 1);
                }
            }
            return self;
        };

        self.unsubscribeLast = function () {
            if (handlers.length) {
                handlers.pop();
            }
            return self;
        };

        self.unsubscribeAll = function () {
            handlers = [];
            return self;
        };

        self.blockEvents = function () {
            blockEvents = true;
        };

        self.notifyBlocked = function (opts) {
            blockEvents = false;

            self.notify(new EventData({
                opts: opts || {},
                data: blockedEventData
            }));

            blockedEventData = [];
        };

        self.notify = function (eventData) {
            if (blockEvents === true) {
                return blockedEventData.push(eventData);
            }

            if (typeof eventData !== EventData) {
                eventData = new EventData(eventData);
            }

            for (var i = 0; i < handlers.length && !eventData.isImmediatePropagationStopped() ; i++) {
                if (handlers[i].call(self, eventData) === false) {
                    self.stopImmediatePropagation();
                    break;
                }
            }
        };
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});