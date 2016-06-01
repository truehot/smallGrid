(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "ColumnSort": ColumnSortPlugin,
            }
        }
    });

    function ColumnSortPlugin(context, settings) {
        var self = this;
        var view = context.view;
        var windowManager = context.windowManager;

        function init() {
            view.onHeaderClick.subscribe(handleHeaderClick);
            return self;
        }

        function destroy() {
            view.onHeaderClick.unsubscribe(handleHeaderClick);
        }

        function handleHeaderClick(evt) {
            if (evt && evt.type && evt.type == "sort") {
                var request = view.suspendRender();
                var column = evt.column;
                var sortOrder = SmallGrid.Utils.changeSortOrder(column.sortOrder);
                view.getModel().getColumnsModel().setColumnsProperty("sortOrder", 0);//reset sorting
                view.getModel().getColumnsModel().setColumnPropertyById(column.id, "sortOrder", sortOrder);
                view.getModel().setSorter(new SmallGrid.Query.SorterQuery(column.field, sortOrder, column.sortComparer));
                view.resumeRender(request);
                //view.render();
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });

    }

})(jQuery);