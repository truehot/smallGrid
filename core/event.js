"use strict";

(function ($) {
    $.extend(true, window, {
        "SmallGrid": {
            "Event": {
                "Args": EventArgs,
                "Handler": EventHandler
            }
        }
    });

    function EventArgs(args) {
        for (var key in args) {
            if (args.hasOwnProperty(key)) {
                this[key] = args[key];
            }
        }

        var isPropagationStopped = false;
        var isImmediatePropagationStopped = false;

        //Prevents any related handlers from being notified of the event.
        this.stopPropagation = function () {
            isPropagationStopped = true;
        };

        this.isPropagationStopped = function () {
            return isPropagationStopped;
        };
        //Keeps the rest of the handlers from being executed
        this.stopImmediatePropagation = function () {
            isImmediatePropagationStopped = true;
        };

        this.isImmediatePropagationStopped = function () {
            return isImmediatePropagationStopped;
        };
    }

    function EventHandler() {
        var handlers = [];

        this.subscribe = function (fn) {
            handlers.push(fn);
            return this;
        };

        this.unsubscribe = function (fn) {
            for (var i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i] === fn) {
                    handlers.splice(i, 1);
                }
            }
            return this;
        };

        this.unsubscribeLast = function () {
            if (handlers.length) {
                handlers.pop();
            }
            return this;
        };

        this.unsubscribeAll = function () {
            handlers = [];
            return this;
        };

        this.notify = function (e) {
            if (typeof (e) != EventArgs) {
                e = new EventArgs(e);
            }

            for (var i = 0; i < handlers.length && !(e.isPropagationStopped() || e.isImmediatePropagationStopped()) ; i++) {
                if (handlers[i].call(this, e) === false) {
                    e.stopImmediatePropagation();
                    break;
                }
            }
        };
    }

})(jQuery);