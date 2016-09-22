(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "ColumnCheckbox": ColumnCheckboxPlugin
        }
    });

    function ColumnCheckboxPlugin(context, settings) {
        var self = this,
            suspended = false;
        /*
         * Init && destroy
         */
        function init() {
            //register plugin settings
            if (!settings.plugins.ColumnCheckbox) {
                settings.plugins.ColumnCheckbox = {
                    enabled: false,
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
            if (settings.plugins.RowSelection.enabled !== true) return;

            if (isSuspended() === false && evt.type === "checkbox" && evt.column && evt.column.headerFormatter === "Checkbox") {
                var request = suspend();

                var headerNode = context.view.getColumnNodeById(evt.column.id);
                if (headerNode) {
                    headerNode.className += ' ' + settings.cssClass.disabledColor;
                }

                changeColumnRows(evt.column, evt.column[evt.column.field]);

                if (headerNode) {
                    headerNode.className.replace(' ' + settings.cssClass.disabledColor, '');
                }

                resume(request);
            }
        }

        /*
         * Internal
         */
        function changeColumnRows(column, value) {
            if (column) {
                if (column.headerFormatter === "Checkbox") {
                    context.columnsModel.setColumnPropertyById(column.id, column.field, !value);
                }
                context.rowsModel.items.setItemsProperty(column.field, !value);
            }
        }

        function isSuspended() {
            return suspended;
        }

        function suspend() {
            suspended = true;
            return context.view.suspendRender();
        }

        function resume(request) {
            suspended = false;
            context.view.resumeRender(request);
        }

        /**
         * API
         */
        function toggleColumnbyId(id, callback) {
            var column = context.columnsModel.getColumnById(id);
            if (column && callback && typeof callback === "function") {
                var request = suspend();
                context.rowsModel.foreach(function (row) {
                    return callback(column, row);
                });
                resume(request);
            }
        }

        function toggleColumnByIndex(idx, callback) {
            var column = context.columnsModel.getColumnByIndex(idx);
            if (column && callback && typeof callback === "function") {
                var request = suspend();
                context.rowsModel.foreach(function (row) {
                    return callback(column, row);
                });
                resume(request);
            }
        }

        function checkColumnById(id) {
            var column = context.columnsModel.getColumnById(id);
            if (column) {
                var request = suspend();
                changeColumnRows(column, false);
                resume(request);
            }
        }

        function checkColumnByIndex(idx) {
            var column = context.columnsModel.getColumnByIndex(idx);
            if (column) {
                var request = suspend();
                changeColumnRows(column, false);
                resume(request);
            }
        }

        function uncheckColumnById(id) {
            var column = context.columnsModel.getColumnById(id);
            if (column) {
                var request = suspend();
                changeColumnRows(column, true);
                resume(request);
            }
        }

        function uncheckColumnByIndex(idx) {
            var column = context.columnsModel.getColumnByIndex(idx);
            if (column) {
                var request = suspend();
                changeColumnRows(column, true);
                resume(request);
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
            "toggleColumnbyId": toggleColumnbyId,
            "toggleColumnByIndex": toggleColumnByIndex,
            "checkColumnById": checkColumnById,
            "checkColumnByIndex": checkColumnByIndex,
            "uncheckColumnById": uncheckColumnById,
            "uncheckColumnByIndex": uncheckColumnByIndex
        });
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});