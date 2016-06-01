(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Handler": {
                "Shared": {
                    "GetInstance": GetInstance,
                    "Handler": SharedHandler,
                }
            }
        }
    });

    function SharedHandler() {
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
            }, 400);
        }

        function destroy() {
            $(window)
                .off("click", handleClick)
                .off("contextmenu", handleContextMenu)
                .off("resize", handleResize)
        }

        $.extend(this, {
            "onClick": new SmallGrid.Event.Handler(),
            "onContextMenu": new SmallGrid.Event.Handler(),
            "onResize": new SmallGrid.Event.Handler(),

            "destroy": destroy
        });
    }

    var handler;

    function GetInstance() {
        if (!handler) {
            handler = new SharedHandler();
        }

        return handler;
    }

})(jQuery);