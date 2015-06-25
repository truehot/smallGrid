"use strict";

(function ($) {

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "RowSelection": RowSelectionPlugin,
            }
        }
    });
    //todo: add shift and ctrl support
    //todo: update css classes
    //todo: keyboard navigation up and down

    function RowSelectionPlugin(viewModel, view, settings) {
        var self = this;
        var selectedRowIds = [];

        function init() {
            view.onCellClick.subscribe(handleCellClick);
            view.onCellKeyDown.subscribe(handeCellKeyDown);
        }

        function destroy() {
            view.onCellClick.unsubscribe(handleCellClick);
            view.onCellKeyDown.unsubscribe(handeCellKeyDown);
        }

        function handleCellClick(e) {
            setSelectedRow(e.row.id);
        }


        function handeCellKeyDown(e) {
            //console.log(e);//todo
        }

        function selectRowById(id) {

            if (isRowSelected(id) === false) {
                var row = viewModel.rows.getRowById(id);
                if (row) {
                    viewModel.rows.setRowPropertyById(
                        id,
                        'rowCssClass',
                        row.rowCssClass + ' ' + settings.cssClass.rowSelected
                    );
                    selectedRowIds.push(id);
                }
            }
        }

        /*
        Public api
        */
        function setSelectedRows(ids) {
            if (settings.allowMultiRowSelection == true) {
                for (var i = 0; i < ids.length; i++) {
                    var row = viewModel.rows.getRowById(ids);
                    if (row) {
                        selectRowById(row.id);
                    }
                }
            }
            return this;
        }

        function clearSelectedRows(skipId) {
            if (selectedRowIds.length) {
                for (var i = 0; i < selectedRowIds.length; i++) {
                    if (selectedRowIds[i] == skipId) {
                        continue;
                    }

                    var row = viewModel.rows.getRowById(selectedRowIds[i]);
                    if (row) {
                        viewModel.rows.setRowPropertyById(
                            row.id,
                            'rowCssClass',
                            row.rowCssClass.replace(' ' + settings.cssClass.rowSelected, '')
                        );
                    }
                    selectedRowIds.splice(i, 1);
                }
            }
            return this;
        }

        function isRowSelected(id) {
            return (selectedRowIds.indexOf(id) !== -1);
        }

        function setSelectedRow(id) {
            if (settings.allowMultiRowSelection == false) {
                clearSelectedRows(id);
            }
            selectRowById(id);
        }

        function getSelectedRows() {
            return selectedRowIds;
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "clearSelectedRows": clearSelectedRows,
            "getSelectedRows": getSelectedRows,
            "isRowSelected": isRowSelected,
            "setSelectedRow": setSelectedRow,
            "setSelectedRows": setSelectedRows,
        });

        init();
    }

})(jQuery);