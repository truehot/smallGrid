(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "AutoResize": AutoResizePlugin
        }
    });

    function AutoResizePlugin(context, settings) {
        var self = this;
        /*
         * Init && destroy
         */
        function init() {
            context.view.onViewResized.subscribe(handleViewResized);
            return self;
        }

        function destroy() {
            context.view.onViewResized.unsubscribe(handleViewResized);
        }

        /*
         * Handlers
         */
        function handleViewResized() {
            if (settings.plugins.AutoResize.enabled === true) {
                resizeColumns();
            }
        }

        function resizeColumnsWidth(allColumns, scrollBarWidth, cellOuterWidth) {
            var contentSize = context.view.getContentSize();
            var updateColumns = allColumns.slice();
            var total =
                {
                    minWidth: 0,
                    maxWidth: 0,
                    width: 0
                },
                contentWidth = contentSize.width - updateColumns.length * cellOuterWidth - scrollBarWidth;

            for (var i = updateColumns.length - 1; i >= 0; i--) {
                var updateColumn = updateColumns[i];
                if (updateColumn.resizeable === false) {
                    contentWidth -= updateColumn.width;
                    updateColumns.splice(i, 1);
                    continue;
                }
                total.minWidth += updateColumn.minWidth;
                total.maxWidth += updateColumn.maxWidth;
                total.width += updateColumn.width;
            }

            if (total.minWidth <= contentWidth && contentWidth <= total.maxWidth) {
                var columns = updateColumns.slice();
                while (columns.length > 0) {
                    var ratio = contentWidth / total.width;
                    total.width = 0;

                    for (i = columns.length - 1; i >= 0; i--) {
                        var column = columns[i];
                        var newColumnWidth = Math.max(
                            Math.min(
                                Math.floor(column.width * ratio),
                                column.maxWidth
                            ),
                            column.minWidth
                        );

                        total.width += newColumnWidth;

                        if (column.width === newColumnWidth) {
                            if (columns.length === 1 && contentWidth !== column.width) {
                                column.width += contentWidth - column.width;
                            }
                            contentWidth -= column.width;
                            columns.splice(i, 1);
                            continue;
                        }

                        column.width = newColumnWidth;
                    }
                }
            }
            return updateColumns;
        }

        /*
         * Public API
         */
        function resizeColumns() {
            var updateColumns = resizeColumnsWidth(
                context.columnsModel.getColumns(),
                context.view.isVerticalScrollVisible() === true ? settings.scrollbarDimensions.width : 0,
                settings.cellOuterSize.width
            );

            context.view.suspendRender(function () {
                context.columnsModel.updateColumns(updateColumns);
            });

            return self;
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "resizeColumns": resizeColumns
        });

    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});
