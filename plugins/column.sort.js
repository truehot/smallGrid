(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "ColumnSort": ColumnSortPlugin,
            }
        }
    });

    function ColumnSortPlugin(view, windowManager, settings) {
        var self = this;
        function init() {
            view.onHeaderClick.subscribe(handleHeaderClick);
        }

        function destroy() {
            view.onHeaderClick.unsubscribe(handleHeaderClick);
        }

        function handleHeaderClick(event) {
            if (event && event.type && event.type == "sort") {
                var request = view.suspendRender();
                var column = event.column;
                var sortOrder = SmallGrid.Utils.changeSortOrder(column.sortOrder);
                view.getModel().columns.setColumnsProperty("sortOrder", 0);//reset sorting
                view.getModel().columns.setColumnPropertyById(column.id, "sortOrder", sortOrder);
                view.getModel().rows.sort(
                    SmallGrid.Column.Comparer[column.sortComparer]({
                        "sortOrder": sortOrder,
                        "field": column.field
                    })
                );

                view.resumeRender(request);
                view.render();
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });

    }

})(jQuery);