(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "RowSelection": RowSelectionPlugin,
            }
        }
    });

    function RowSelectionPlugin(view, windowManager, settings) {
        var self = this;
        var selectedRowIds = [];
        var lastFocusedRowId = null;

        function init() {
            view.onCellClick.subscribe(handleCellClick);
        }

        function destroy() {
            view.onCellClick.unsubscribe(handleCellClick);
        }

        function handleCellClick(event) {
            var request = view.suspendRender();
            if (event.event.shiftKey === true && settings.plugins.RowSelection.multipleRowSelection === true && lastFocusedRowId && lastFocusedRowId != event.row.id) {
                clearSelectedRows(selectedRowIds);

                var lastFocusedRow = view.getModel().rows.getRowById(lastFocusedRowId);
                var currentRow = view.getModel().rows.getRowById(event.row.id);

                if (lastFocusedRow && currentRow) {
                    selectRowsRange(lastFocusedRowId, event.row.id);
                }

            } else if (event.event.ctrlKey === true && settings.plugins.RowSelection.multipleRowSelection) {
                if (isRowSelected(event.row.id) === false) {
                    selectRowById(event.row.id);
                } else {
                    clearSelectedRow(event.row.id);
                }
            } else {
                var clearRowsIds = selectedRowIds.slice();
                var selectedIndex = clearRowsIds.indexOf(event.row.id);

                if (selectedIndex === -1) {
                    selectRowById(event.row.id);
                } else {
                    clearRowsIds.splice(selectedIndex, 1);
                }

                clearSelectedRows(clearRowsIds);
            }
            view.resumeRender(request);
            view.render();
            if (event.event.shiftKey === false) lastFocusedRowId = event.row.id;
        }

        function selectRowsRange(id1, id2) {
            var lastFocusedIndex = view.getModel().rows.getRowIndexById(id1);
            var currentRowIndex = view.getModel().rows.getRowIndexById(id2);
            if (lastFocusedIndex !== -1 && currentRowIndex !== -1) {
                var startIndex = Math.min(currentRowIndex, lastFocusedIndex);
                var endIndex = Math.max(currentRowIndex, lastFocusedIndex);

                for (var i = startIndex ; i <= endIndex; i++) {
                    selectRowByIndex(i);
                }
            }
            return self;
        }

        function selectRow(row) {
            if (row) {
                view.getModel().rows.setRowPropertyById(
                    row.id,
                    'rowCssClass',
                    row.rowCssClass + ' ' + settings.cssClass.rowSelected
                );
                selectedRowIds.push(row.id);
            }
        }

        function selectRowByIndex(idx) {
            selectRow(
                view.getModel().rows.getRowByIndex(idx)
            );
            return self;
        }

        function selectRowById(id) {
            selectRow(
                view.getModel().rows.getRowById(id)
            );
            return self;
        }

        function clearSelectedRows(ids) {
            for (var i = ids.length - 1; i >= 0; i--) {
                clearSelectedRow(ids[i]);
            }
            return self;
        }

        function clearSelectedRow(id) {
            var row = view.getModel().rows.getRowById(id);
            if (row) {
                view.getModel().rows.setRowPropertyById(
                    row.id,
                    'rowCssClass',
                    row.rowCssClass.replace(' ' + settings.cssClass.rowSelected, '')
                );
            }
            var selectedIndex = selectedRowIds.indexOf(id);
            if (selectedIndex !== -1) {
                selectedRowIds.splice(selectedIndex, 1);
            }

            return self;
        }

        function isRowSelected(id) {
            return (selectedRowIds.indexOf(id) !== -1);
        }

        function getSelectedRowsIds() {
            return selectedRowIds;
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "clearSelectedRow": clearSelectedRow,
            "clearSelectedRows": clearSelectedRows,
            "getSelectedRowsIds": getSelectedRowsIds,
            "isRowSelected": isRowSelected,
            "selectRowByIndex": selectRowByIndex,
            "selectRowById": selectRowById,
            "selectRowsRange": selectRowsRange,

        });

    }

})(jQuery);