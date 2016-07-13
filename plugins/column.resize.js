(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "ColumnResize": ColumnResizePlugin
        }
    });

    function ColumnResizePlugin(context, settings) {
        var self = this,
            column,
            el = {},
            width;

        function init() {
            context.view.onColumnResize.subscribe(handleColumnResize);
            context.view.onColumnResizeStart.subscribe(handleColumnResizeStart);
            context.view.onColumnResizeStop.subscribe(handleColumnResizeStop);
            return self;
        }

        function destroy() {
            context.view.onColumnResize.unsubscribe(handleColumnResize);
            context.view.onColumnResizeStart.unsubscribe(handleColumnResizeStart);
            context.view.onColumnResizeStop.unsubscribe(handleColumnResizeStop);

            var elKeys = Object.keys(el);
            for (var i = 0; i < elKeys.length; i++) {
                el[elKeys[i]].remove();
                delete el[elKeys[i]];
            }

            column = null;
        }

        function handleColumnResize(evt) {
            if (column && el.lastHeaderCol.length && settings.plugins.ColumnResize.enabled === true) {
                width = Math.max(
                    Math.min(
                        parseInt(evt.width, 10),
                        column.maxWidth
                    ),
                    column.minWidth
                );

                if (el.headerCol.length) el.headerCol.css("width", width + settings.cellOuterSize.width);
                if (el.contentCol.length) el.contentCol.css("width", width + settings.cellOuterSize.width);
            }
        }

        function handleColumnResizeStart(evt) {
            if (settings.plugins.ColumnResize.enabled !== true) return;

            column = context.viewModel.getColumnByIndex(evt.cellIndex);

            el = {
                headerCursorCells: context.view.getNode('headerTbody').find("." + settings.cssClass.cursorPointer),
                headerCol: context.view.getNode('headerTable').find("colgroup > col:nth-child(" + (evt.cellIndex + 1) + ")"),
                contentCol: context.view.getNode('contentTable').find("colgroup > col:nth-child(" + (evt.cellIndex + 1) + ")"),
                lastHeaderCol: context.view.getNode('headerTable').find("colgroup > col:last"),
                lastContentCol: context.view.getNode('contentTable').find("colgroup > col:last"),
                contentCell: "",
                headerCell: ""
            };

            if (column && el.lastHeaderCol.length) {

                if (settings.showLastColumn === true && el.lastHeaderCol.hasClass(settings.cssClass.collLast)) {
                    el.lastHeaderCol.width($(window).width());
                    if (el.lastContentCol.length) el.lastContentCol.width($(window).width());
                }

                el.headerCell = context.view.getNode('headerTable').find('td.' + settings.cssClass.cellColumnLast);
                if (el.headerCell.length) toggleDisabled(el.headerCell, settings.cssClass.cellColumnLast);

                el.contentCell = context.view.getNode('contentTable').find('td.' + settings.cssClass.cellColumnLast);
                if (el.contentCell.length) toggleDisabled(el.contentCell, settings.cssClass.cellColumnLast);

                toggleDisabled(el.headerCursorCells, settings.cssClass.cursorPointer);
                context.view.getNode('viewport').addClass(settings.cssClass.cursorResize);
            }
        }

        function handleColumnResizeStop() {
            if (column && settings.plugins.ColumnResize.enabled === true) {

                if (el.headerCell.length) toggleEnabled(el.headerCell, settings.cssClass.cellColumnLast);
                if (el.contentCell.length) toggleEnabled(el.contentCell, settings.cssClass.cellColumnLast);

                toggleEnabled(el.headerCursorCells, settings.cssClass.cursorPointer);
                context.view.getNode('viewport').removeClass(settings.cssClass.cursorResize);

                if (width) {
                    context.columnsModel.setColumnPropertyById(
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
            "destroy": destroy
        });

    }
})(jQuery, window.SmallGrid = window.SmallGrid || {});