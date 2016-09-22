(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Event": {
            "Data": EventData,
            "Handler": EventHandler,
            "Create": Create
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
        this.handlers = [];
    }

    EventHandler.prototype.subscribe = function (func) {
        if ($.isFunction(func)) {
            this.handlers.push(func);
        }
        return this;
    };

    EventHandler.prototype.unsubscribe = function (func) {
        for (var i = this.handlers.length - 1; i >= 0; i--) {
            if (this.handlers[i] === func) {
                this.handlers.splice(i, 1);
            }
        }
        return this;
    };

    EventHandler.prototype.unsubscribeAll = function () {
        this.handlers = [];
        return this;
    };

    EventHandler.prototype.notify = function (eventData) {
        if (typeof eventData !== EventData) {
            eventData = new EventData(eventData);
        }

        for (var i = 0, len = this.handlers.length; i < len && eventData.isImmediatePropagationStopped() === false; i++) {
            if (this.handlers[i].call(null, eventData) === false) {
                this.stopImmediatePropagation();
                break;
            }
        }
    };


    function Create() {
        return new EventHandler();
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});