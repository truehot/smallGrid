(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "ColumnResize": ColumnResizePlugin,
            }
        }
    });

    function ColumnResizePlugin(view, windowManager, settings) {
        var self = this;

        var column,
            $headerTable,
            $contentCell,
            $contentCol,
            $headerCell,
            $headerCursorCells,
            $headerCol,
            $lastContentCol,
            $lastHeaderCol,
            headerWidth,
            width;

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

        function handleColumnResize(event) {
            if (column && $lastHeaderCol.length) {
                width = Math.max(
                    Math.min(
                        parseInt(event.width, 10),
                        column.maxWidth
                    ),
                    column.minWidth
                );

                if ($headerCol.length) $headerCol.css("width", width + settings.cellOuterSize.width);
                if ($contentCol.length) $contentCol.css("width", width + settings.cellOuterSize.width);

                var wrapWidth = Math.max(view.getNode('headerTable').width(), headerWidth);
                view.getNode('headerWrap').width(wrapWidth);
                view.getNode('contentWrap').width(wrapWidth);
            }
        }

        function handleColumnResizeStart(event) {
            headerWidth = view.getNode('header').width();
            column = view.getModel().getColumnByIndex(event.cellIndex);
            $headerCursorCells = view.getNode('headerTbody').find("." + settings.cssClass.cursorPointer);
            $headerCol = view.getNode('headerTable').find("colgroup > col:nth-child(" + (event.cellIndex + 1) + ")");
            $contentCol = view.getNode('contentTable').find("colgroup > col:nth-child(" + (event.cellIndex + 1) + ")");
            $lastHeaderCol = view.getNode('headerTable').find("colgroup > col:last");
            $lastContentCol = view.getNode('contentTable').find("colgroup > col:last");

            if (column && $lastHeaderCol.length) {

                if (settings.showLastColumn == true && $lastHeaderCol.hasClass(settings.cssClass.collLast)) {
                    $lastHeaderCol.width(0);
                    if ($lastContentCol.length) $lastContentCol.width(0);
                }

                $headerCell = view.getNode('headerTable').find('td.' + settings.cssClass.cellLast);
                if ($headerCell.length) toggleDisabled($headerCell, settings.cssClass.cellLast);

                $contentCell = view.getNode('contentTable').find('td.' + settings.cssClass.cellLast);
                if ($contentCell.length) toggleDisabled($contentCell, settings.cssClass.cellLast);

                toggleDisabled($headerCursorCells, settings.cssClass.cursorPointer);
                view.getNode('viewport').addClass(settings.cssClass.cursorResize);
            }
        }

        function handleColumnResizeStop() {
            if (column) {

                if ($headerCell.length) toggleEnabled($headerCell, settings.cssClass.cellLast);
                if ($contentCell.length) toggleEnabled($contentCell, settings.cssClass.cellLast);


                toggleEnabled($headerCursorCells, settings.cssClass.cursorPointer);
                view.getNode('viewport').removeClass(settings.cssClass.cursorResize);

                if (width) {
                    view.getModel().columns.setColumnPropertyById(
                        column.id,
                        'width',
                        width
                    );
                }
            }
        }

        function toggleEnabled($elements, cssClass) {
            $elements.toggleClass(cssClass + ' ' + cssClass + '-disabled');
        }

        function toggleDisabled($elements, cssClass) {
            $elements.toggleClass(cssClass + '-disabled' + ' ' + cssClass);
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });

    }

})(jQuery);