(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Handler": {
            "Shared": {
                "GetInstance": GetInstance,
                "Handler": SharedHandler
            }
        }
    });

    function SharedHandler(settings) {
        var self = this,
            resizeTimer;

        $(window)
            .on("click", handleClick)
            .on("contextmenu", handleContextMenu)
            .on("resize", handleResize);

        function handleClick(evt) {
            self.onClick.notify({
                event: evt
            });
        }

        function handleContextMenu(evt) {
            self.onContextMenu.notify({
                event: evt
            });
        }

        function handleResize(evt) {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }

            resizeTimer = setTimeout(function () {
                self.onResize.notify({
                    event: evt
                });
            }, settings.latency);
        }

        function getSettings() {
            return settings;
        }

        function destroy() {
            clearTimeout(resizeTimer);
            $(window)
                .off("click", handleClick)
                .off("contextmenu", handleContextMenu)
                .off("resize", handleResize);
        }

        $.extend(this, {
            "onClick": new SmallGrid.Event.Handler(),
            "onContextMenu": new SmallGrid.Event.Handler(),
            "onResize": new SmallGrid.Event.Handler(),
            "getSettings": getSettings,
            "destroy": destroy
        });
    }

    var handler;

    function GetInstance(options) {
        if (!handler) {
            var defaultSettings = {
                "latency": 400
            };

            var settings = $.extend({}, defaultSettings, options);

            handler = new SharedHandler(settings);
        }

        return handler;
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});