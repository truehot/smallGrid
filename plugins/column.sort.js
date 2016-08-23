(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "ColumnSort": ColumnSortPlugin
        }
    });

    function ColumnSortPlugin(context, settings) {
        var self = this;

        /*
         * Init && destroy
         */
        function init() {
            //register plugin settings
            if (!settings.plugins.ColumnSort) {
                settings.plugins.ColumnSort = {
                    enabled: false
                };
            }

            context.view.onHeaderClick.subscribe(handleHeaderClick);
            return self;
        }

        function destroy() {
            context.view.onHeaderClick.unsubscribe(handleHeaderClick);
        }

        /*
         * Handlers
         */
        function handleHeaderClick(evt) {
            if (evt && (evt.type === "" || evt.type === "sort") && settings.plugins.ColumnSort.enabled === true) {
                var request = context.view.suspendRender();
                sortColumn(evt.column);
                context.view.resumeRender(request);
            }
        }

        function sortColumn(column, sortOrder) {
            if (column) {
                var newSortOrder = sortOrder === undefined ? SmallGrid.Utils.changeSortOrder(column.sortOrder) : sortOrder;
                context.columnsModel.setColumnsProperty("sortOrder", 0);//reset sorting
                context.columnsModel.setColumnPropertyById(column.id, "sortOrder", newSortOrder);
                context.viewModel.setSorter(new SmallGrid.Query.Sorter(column.field, newSortOrder, column.sortComparer));
            }
        }

        /*
         * Public API
         */
        function sortColumnById(id, sortOrder) {
            var column = context.columnsModel.getColumnById(id);
            if (column) {
                var request = context.view.suspendRender();
                sortColumn(column, sortOrder);
                context.view.resumeRender(request);
            }
        }

        function sortColumnByIndex(idx, sortOrder) {
            var column = context.columnsModel.getColumnByIndex(idx);
            if (column) {
                var request = context.view.suspendRender();
                sortColumn(column, sortOrder);
                context.view.resumeRender(request);
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "sortColumnById": sortColumnById,
            "sortColumnByIndex": sortColumnByIndex
        });

    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});