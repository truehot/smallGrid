(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Callback": {
            "Handler": CallbackHandler,
            "Create": Create,
        }
    });

    function CallbackHandler() {
        this.handlers = [];
        this.isLocked = false;
        this.lockedData = [];
    }

    CallbackHandler.prototype.subscribe = function (func) {
        if ($.isFunction(func)) {
            this.handlers.push(func);
        }
        return this;
    };

    CallbackHandler.prototype.unsubscribe = function (func) {
        for (var i = this.handlers.length - 1; i >= 0; i--) {
            if (this.handlers[i] === func) {
                this.handlers.splice(i, 1);
            }
        }
        return this;
    };

    CallbackHandler.prototype.unsubscribeAll = function () {
        this.handlers = [];
        return this;
    };

    CallbackHandler.prototype.notify = function () {
        var result = arguments[0];

        if (this.isLocked === true) {
            this.lockedData.push(result);
            return result;
        }

        for (var i = 0; i < this.handlers.length; i++) {
            result = this.handlers[i].apply(null, arguments);
        }
        return result;
    };

    CallbackHandler.prototype.lock = function () {
        this.isLocked = true;
        this.lockedData = [];
    };

    CallbackHandler.prototype.notifyLocked = function () {
        this.isLocked = false;
        return this.notify({ data: this.lockedData });
    };


    function Create() {
        return new CallbackHandler();
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});