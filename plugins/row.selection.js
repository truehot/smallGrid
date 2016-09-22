(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "RowSelection": RowSelectionPlugin
        }
    });

    function RowSelectionPlugin(context, settings) {
        var self = this,
            suspended = false,
            selectedIds = [],
            selectionColumn = null,
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
            context.view.onHeaderClick.subscribe(handleHeaderClick);
            return self;
        }

        function destroy() {
            context.view.onCellClick.unsubscribe(handleCellClick);
            context.view.onHeaderClick.unsubscribe(handleHeaderClick);
        }

        /*
         * Handlers
         */
        function handleHeaderClick(evt) {
            if (settings.plugins.RowSelection.enabled !== true) return;

            if (evt.type === "selection-checkbox" && evt.column && evt.column.headerFormatter === "SelectionCheckbox") {

                var request = suspend();

                var headerNode = context.view.getColumnNodeById(evt.column.id);
                if (headerNode) {
                    headerNode.className += ' ' + settings.cssClass.disabledColor;
                }

                if (!evt.column[evt.column.field]) {
                    selectAll(evt.column);
                } else {
                    deselectAll(evt.column);
                }

                if (headerNode) {
                    headerNode.className.replace(' ' + settings.cssClass.disabledColor,'');
                }

                resume(request);
            }
        }

        function handleCellClick(evt) {
            if (settings.plugins.RowSelection.enabled !== true) return;

            var request = suspend();
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
                if (isRowSelected(evt.row.id) === false || selectedIds.length > 0) {
                    deselectAllRows();
                    selectRowById(evt.row.id);
                }
            }

            resume(request);

            if (evt.event.shiftKey === false) lastFocusedId = evt.row.id;
        }

        /*
         * Internal
         */
        function findSelectionColumn() {
            if (selectionColumn) {
                selectionColumn = context.columnsModel.getColumnById(selectionColumn.id);
            }

            if (!selectionColumn) {
                var columns = context.columnsModel.getColumns();
                for (var i = 0, len = columns.length; i < len; i++) {
                    if (columns[i].headerFormatter && columns[i].headerFormatter === "SelectionCheckbox") {
                        return columns[i];
                    }
                }
            }
        }

        function selectAll(column, callback) {
            context.viewModel.requestRowsCallback(function (row, idx) {

                if (typeof callback === "function") {
                    if (!callback(row, idx)) return false;
                }

                selectedIds.push(row.id);
                row.rowCssClass += (row.rowCssClass.length ? " " : "") + settings.cssClass.rowSelected;
                var rowNode = context.view.getRowNodeById(row.id);
                if (rowNode) {
                    rowNode.className = rowNode.className + ' ' + settings.cssClass.rowSelected;
                }

                if (column) {
                    row.item[column.field] = true;
                    var cell = context.view.getCellNodeById(column.id, row.id);
                    if (cell && column && column.formatter != "") {
                        cell.innerHTML = context.view.getBuilder().buildCellContentHtml(column, row);
                    }
                }
            });

            if (column && !callback) context.columnsModel.setColumnPropertyById(column.id, column.field, true);
        }

        function deselectAll(column, callback) {
            if (selectedIds.length) {

                if (selectedIds.length < 3000) {
                    for (var i = selectedIds.length - 1; i >= 0; i--) {
                        deselectRow(context.rowsModel.getRowById(selectedIds[i]), column);
                    }
                } else {

                    context.rowsModel.foreach(function (row, idx) {
                        if (typeof callback === "function") {
                            if (!callback(row, idx)) return false;
                        }

                        row.rowCssClass = row.rowCssClass.replace(' ' + settings.cssClass.rowSelected, '').replace(settings.cssClass.rowSelected, '');
                        var rowNode = context.view.getRowNodeById(row.id);
                        if (rowNode) {
                            rowNode.className = rowNode.className.replace(' ' + settings.cssClass.rowSelected, '').replace(settings.cssClass.rowSelected, '');
                        }

                        if (column) {
                            row.item[column.field] = false;
                            var cell = context.view.getCellNodeById(column.id, row.id);
                            if (cell && column && column.formatter != "") {
                                cell.innerHTML = context.view.getBuilder().buildCellContentHtml(column, row);
                            }
                        }
                    });
                }
                selectedIds = [];
                if (column) context.columnsModel.setColumnPropertyById(column.id, column.field, false);
            }
        }

        function selectRow(row, column) {
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

                if (column) {
                    row.item[column.field] = true;
                    var cell = context.view.getCellNodeById(column.id, row.id);
                    if (cell && column && column.formatter != "") {
                        cell.innerHTML = context.view.getBuilder().buildCellContentHtml(column, row);
                    }
                }
            }
        }

        function deselectRow(row, column) {
            if (row) {
                var idx = selectedIds.indexOf(row.id);
                if (idx !== -1) {
                    selectedIds.splice(idx, 1);
                }

                var rowNode = context.view.getRowNodeById(row.id);
                if (rowNode) {
                    rowNode.className = rowNode.className.replace(' ' + settings.cssClass.rowSelected, '').replace(settings.cssClass.rowSelected, '');
                }

                context.rowsModel.setRowPropertyById(
                    row.id,
                    'rowCssClass',
                    row.rowCssClass.replace(' ' + settings.cssClass.rowSelected, '').replace(settings.cssClass.rowSelected, '')
                );

                if (column) {
                    row.item[column.field] = false;
                    var cell = context.view.getCellNodeById(column.id, row.id);
                    if (cell && column && column.formatter != "") {
                        cell.innerHTML = context.view.getBuilder().buildCellContentHtml(column, row);
                    }
                }
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

        /*
         * Public API
         */
        function selectRowById(id) {
            var request = suspend();
            selectRow(context.rowsModel.getRowById(id), findSelectionColumn());
            resume(request);
            return self;
        }

        function deselectRowById(id) {
            var request = suspend();
            deselectRow(context.rowsModel.getRowById(id), findSelectionColumn());
            resume(request);
            return self;
        }

        function selectRowByIndex(idx) {
            var request = suspend();
            selectRow(context.rowsModel.getRowByIndex(idx), findSelectionColumn());
            resume(request);
            return self;
        }

        function deselectRowByIndex(idx) {
            var request = suspend();
            deselectRow(context.rowsModel.getRowByIndex(idx), findSelectionColumn());
            resume(request);
            return self;
        }

        function selectRowsRangeByIndex(firstIdx, lastIdx) {
            if (firstIdx > -1 && lastIdx > -1) {
                var request = suspend();

                var column = findSelectionColumn();
                var startIndex = Math.min(lastIdx, firstIdx);
                var endIndex = Math.max(lastIdx, firstIdx);

                selectAll(column, function (row, idx) {
                    return startIndex <= idx && idx <= endIndex;
                });

                resume(request);
            }
            return self;
        }

        function selectRowsRangeById(firstId, lastId) {
            var firstFocusedIndex = context.rowsModel.getRowIndexById(firstId);
            var lastFocusedIndex = context.rowsModel.getRowIndexById(lastId);
            if (firstFocusedIndex !== -1 && lastFocusedIndex !== -1) {
                var request = suspend();

                var column = findSelectionColumn();
                var startIndex = Math.min(lastFocusedIndex, firstFocusedIndex);
                var endIndex = Math.max(lastFocusedIndex, firstFocusedIndex);

                selectAll(column, function (row, idx) {
                    return startIndex <= idx && idx <= endIndex;
                });

                resume(request);
            }
        }

        function deselectRowsRangeByIndex(firstIdx, lastIdx) {
            if (firstIdx > -1 && lastIdx > -1) {
                var request = suspend();

                var column = findSelectionColumn();
                var startIndex = Math.min(lastIdx, firstIdx);
                var endIndex = Math.max(lastIdx, firstIdx);

                deselectAll(column, function (row, idx) {
                    return startIndex <= idx && idx <= endIndex;
                });

                resume(request);
            }
            return self;
        }

        function deselectRowsRangeById(firstId, lastId) {
            var firstFocusedIndex = context.rowsModel.getRowIndexById(firstId);
            var lastFocusedIndex = context.rowsModel.getRowIndexById(lastId);
            if (firstFocusedIndex !== -1 && lastFocusedIndex !== -1) {
                var request = suspend();

                var column = findSelectionColumn();
                var startIndex = Math.min(lastFocusedIndex, firstFocusedIndex);
                var endIndex = Math.max(lastFocusedIndex, firstFocusedIndex);

                deselectAll(column, function (row, idx) {
                    return startIndex <= idx && idx <= endIndex;
                });

                resume(request);
            }
        }

        function deselectAllRows() {
            var request = suspend();
            deselectAll(findSelectionColumn());
            resume(request);
            return self;
        }

        function selectAllRows() {
            var request = suspend();
            selectAll(findSelectionColumn());
            resume(request);
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
            "deselectRowsRangeById": deselectRowsRangeById,
            "deselectRowsRangeByIndex": deselectRowsRangeByIndex,
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