"use strict";

(function ($) {

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "ColumnResize": ColumnResizePlugin,
            }
        }
    });

    function ColumnResizePlugin(viewModel, view, settings) {
        var self = this;
        var column;
        var width;

        function init() {
            view.onColumnResize.subscribe(handleColumnResize);
            view.onColumnResizeStart.subscribe(handleColumnResizeStart);
            view.onColumnResizeStop.subscribe(handleColumnResizeStop);
        }

        function destroy() {
            view.onColumnResize.unsubscribe(handleColumnResize);
            view.onColumnResizeStart.subscribe(handleColumnResizeStart);
            view.onColumnResizeStop.subscribe(handleColumnResizeStop);
        }

        function handleColumnResize(e) {
            if (column) {
                width = Math.max(
                    Math.min(
                        parseInt(e.width, 10),
                        column.maxWidth
                    ),
                    column.minWidth
                );
                //change visual width
                view.setColumnWidthByIndex(e.cellIndex + 1, width);
            }
        }

        function handleColumnResizeStart(e) {
            column = viewModel.getColumnByIndex(e.cellIndex);

            if (column) {
                view.disableHeaderClass(settings.cssClass.cursorPointer);
                view.addViewPortClass(settings.cssClass.cursorResize);
            }
        }

        function handleColumnResizeStop(e) {
            
            if (column) {
                if (width) {
                    viewModel.columns.setColumnPropertyById(
                        column.id,
                        'width',
                        width
                    );
                }
                view.enableHeaderClass(settings.cssClass.cursorPointer);
                view.removeViewPortClass(settings.cssClass.cursorResize);
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });

        init();
    }

})(jQuery);