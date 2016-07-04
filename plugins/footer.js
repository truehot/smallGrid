(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "Footer": FooterPlugin
        }
    });

    function FooterPlugin(context, settings) {
        var self = this;

    }
})(jQuery, window.SmallGrid = window.SmallGrid || {});