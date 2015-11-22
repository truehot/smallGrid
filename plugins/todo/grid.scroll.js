"use strict";

(function ($) {

    $.extend(true, window, {
        "Small": {
            "Plugins": {
                "Scroll": ScrollPlugin,
            }
        }
    });

    function ScrollPlugin(viewModel, view, settings) {
        var self = this;

        function init() {
            view.onColumnResize.subscribe(handleCellEdit);

        }

        function destroy() {
            view.onColumnResize.unsubscribe(handleColumnResize);

        }

        function handleCellEdit(e) {
        }


        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });

        init();
    }

})(jQuery);