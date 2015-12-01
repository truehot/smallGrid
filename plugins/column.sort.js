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

        function handleHeaderClick(evt) {
            if (evt && evt.type && evt.type == "sort") {
                var request = view.suspendRender();
                var column = evt.column;
                var sortOrder = SmallGrid.Utils.changeSortOrder(column.sortOrder);
                view.getModel().columns.setColumnsProperty("sortOrder", 0);//reset sorting
                view.getModel().columns.setColumnPropertyById(column.id, "sortOrder", sortOrder);
                view.getModel().setSorter(new SmallGrid.Query.SorterQuery(column.field, sortOrder, column.sortComparer));
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