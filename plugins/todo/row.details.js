"use strict";

(function ($) {

    $.extend(true, window, {
        "Small": {
            "Plugins": {
                "RowDetails": RowDetailsPlugin,
            }
        }
    });

    function RowDetailsPlugin(viewModel, view, settings) {
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