(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "RowSelection": RowSelectionPlugin
        }
    });

    function RowSelectionPlugin(context, settings) {
        var self = this,
            selectedIds = [],
            lastFocusedId = null;
        /*
         * Init && destroy
         */
        function init() {
            //register plugin settings
            if (!settings.plugins.RowSelection) {
                settings.plugins.RowSelection = {
                    enabled: false,
                    multipleRowSelection: false//allow multiplerow selection
                };
            }

            context.view.onCellClick.subscribe(handleCellClick);
            return self;
        }

        function destroy() {
            context.view.onCellClick.unsubscribe(handleCellClick);
        }
        /*
         * Handlers
         */
        function handleCellClick(evt) {
            if (settings.plugins.RowSelection.enabled !== true) return;

            var request = context.view.suspendRender();
            if (evt.event.shiftKey === true && settings.plugins.RowSelection.multipleRowSelection === true && lastFocusedId && lastFocusedId !== evt.row.id) {

                selectRowsRangeById(lastFocusedId, evt.row.id);

            } else if (evt.event.ctrlKey === true) {
                if (isRowSelected(evt.row.id) === true) {
                    deselectRowById(evt.row.id);
                } else {
                    if (settings.plugins.RowSelection.multipleRowSelection === false) {
                        deselectAllRows();
                    }
                    selectRowById(evt.row.id);
                }
            } else {
                if (isRowSelected(evt.row.id) === false || selectedIds.length > 1) {
                    deselectAllRows();
                    selectRowById(evt.row.id);
                }
            }

            context.view.resumeRender(request);

            if (evt.event.shiftKey === false) lastFocusedId = evt.row.id;
        }

        function selectRow(row) {
            if (row) {
                selectedIds.push(row.id);

                var rowNode = context.view.getRowNodeById(row.id);
                if (rowNode) {
                    rowNode.className = rowNode.className + ' ' + settings.cssClass.rowSelected;
                }

                context.rowsModel.setRowPropertyById(
                    row.id,
                    'rowCssClass',
                    row.rowCssClass + (row.rowCssClass.length ? " " : "") + settings.cssClass.rowSelected
                );
            }
        }

        function deselectRow(row) {
            if (row) {
                var idx = selectedIds.indexOf(row.id);
                if (idx !== -1) {
                    selectedIds.splice(idx, 1);
                }

                var rowNode = context.view.getRowNodeById(row.id);
                if (rowNode) {
                    rowNode.className = rowNode.className.replace(' ' + settings.cssClass.rowSelected, '');
                }

                context.rowsModel.setRowPropertyById(
                    row.id,
                    'rowCssClass',
                    row.rowCssClass.replace(' ' + settings.cssClass.rowSelected, '').replace(settings.cssClass.rowSelected, '')
                );
            }
        }

        /*
         * Public API
         */
        function selectRowById(id) {
            var request = context.view.suspendRender();

            selectRow(context.rowsModel.getRowById(id));

            context.view.resumeRender(request);
            return self;
        }

        function deselectRowById(id) {
            var request = context.view.suspendRender();
            deselectRow(context.rowsModel.getRowById(id));
            context.view.resumeRender(request);
            return self;
        }

        function selectRowByIndex(idx) {
            var request = context.view.suspendRender();

            selectRow(context.rowsModel.getRowByIndex(idx));

            context.view.resumeRender(request);
            return self;
        }

        function deselectRowByIndex(idx) {
            var request = context.view.suspendRender();

            deselectRow(context.rowsModel.getRowByIndex(idx));

            context.view.resumeRender(request);
            return self;
        }

        function selectRowsRangeByIndex(firstIdx, lastIdx) {
            if (firstIdx > -1 && lastIdx > -1) {
                var request = context.view.suspendRender();

                var startIndex = Math.min(lastIdx, firstIdx);
                var endIndex = Math.max(lastIdx, firstIdx);

                for (var i = startIndex; i <= endIndex; i++) {
                    selectRow(context.rowsModel.getRowByIndex(i));
                }
                context.view.resumeRender(request);
            }
            return self;
        }

        function selectRowsRangeById(firstId, lastId) {
            var firstFocusedIndex = context.rowsModel.getRowIndexById(firstId);
            var lastFocusedIndex = context.rowsModel.getRowIndexById(lastId);
            if (firstFocusedIndex !== -1 && lastFocusedIndex !== -1) {
                var request = context.view.suspendRender();
                var startIndex = Math.min(lastFocusedIndex, firstFocusedIndex);
                var endIndex = Math.max(lastFocusedIndex, firstFocusedIndex);

                for (var i = startIndex; i <= endIndex; i++) {
                    selectRow(context.rowsModel.getRowByIndex(i));
                }
                context.view.resumeRender(request);
            }
        }

        function deselectAllRows() {
            var request = context.view.suspendRender();
            var selectedIds = getSelectedRowsIds().slice();
            for (var i = 0; i < selectedIds.length; i++) {
                deselectRowById(selectedIds[i]);
            }

            context.view.resumeRender(request);
            return self;
        }

        function selectAllRows() {
            var request = context.view.suspendRender();

            var rows = context.rowsModel.getRows();
            for (var i = 0; i < rows.length; i++) {
                selectRowById(rows[i]);
            }

            context.view.resumeRender(request);
            return self;
        }

        function isRowSelected(id) {
            return selectedIds.indexOf(id) !== -1;
        }

        function getSelectedRowsIds() {
            return selectedIds;
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "deselectAllRows": deselectAllRows,
            "deselectRowById": deselectRowById,
            "deselectRowByIndex": deselectRowByIndex,
            "getSelectedRowsIds": getSelectedRowsIds,
            "isRowSelected": isRowSelected,
            "selectAllRows": selectAllRows,
            "selectRowById": selectRowById,
            "selectRowByIndex": selectRowByIndex,
            "selectRowsRangeById": selectRowsRangeById,
            "selectRowsRangeByIndex": selectRowsRangeByIndex
        });
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});