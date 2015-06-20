"use strict";

(function ($) {

    $.extend(true, window, {
        "Small": {
            "Plugins": {
                "ColumnSort": ColumnSortPlugin,
            }
        }
    });

    function ColumnSortPlugin(viewModel, view, settings) {
        var self = this;
        function init() {
            view.onHeaderClick.subscribe(handleHeaderClick);
        }

        function destroy() {
            view.onHeaderClick.unsubscribe(handleHeaderClick);
        }

        function handleHeaderClick(e) {
            if (e && e.type && e.type == "sort") {
                viewModel.resetCacheRange();

                var column = e.column;
                var sortOrder = settings.Utils.changeSortOrder(column.sortOrder);//todo: remade
                viewModel.columns.setColumnsProperty("sortOrder", 0);//reset sorting
                viewModel.columns.setColumnPropertyById(column.id, "sortOrder", sortOrder);
                viewModel.rows.sort(
                    settings.RowComparer[column.sortComparer]({
                        "sortOrder": sortOrder,
                        "field": column.field
                    })
                );
            }
        }

        //todo
        function sortColumnByIndex(idx, sortOrder) {

        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });

        init();
    }

})(jQuery);