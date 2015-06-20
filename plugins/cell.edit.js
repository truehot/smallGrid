"use strict";
/*
Required
email

*/
(function ($) {

    $.extend(true, window, {
        "Small": {
            "Plugins": {
                "CellEdit": CellEditPlugin,
            }
        }
    });



    function CellEditPlugin(viewModel, view, settings) {
        var self = this;

        var history = [];//todo: history

        var editOptions = {
            enabled: false
        };

        function init() {
            view.onAfterRowsRendered.subscribe(handelAfterRowsRendered);
            view.onBeforeRowsRendered.subscribe(handelBeforeRowsRendered);
            view.onCellClick.subscribe(handleCellClick);
            view.onCellDblClick.subscribe(handleCellDblClick);
            view.onCellKeyDown.subscribe(handeCellKeyDown);
            view.onScrollStop.subscribe(handleScrollStop);
        }

        function destroy() {
            view.onAfterRowsRendered.unsubscribe(handelAfterRowsRendered);
            view.onBeforeRowsRendered.unsubscribe(handelBeforeRowsRendered);
            view.onCellClick.unsubscribe(handleCellClick);
            view.onCellDblClick.unsubscribe(handleCellDblClick);
            view.onCellKeyDown.unsubscribe(handeCellKeyDown);
            view.onScrollStop.unsubscribe(handleScrollStop);
        }

        function handleScrollStop(e) {
            if (isEditMode() == true && settings.edit.autoFocus == true) {
                if (view.isCellVisible(editOptions.column.id, editOptions.row.id)) {
                    editOptions.editor.focus();
                }
            }
        }

        function handelBeforeRowsRendered(e) {
            if (isEditMode() == true) {
                editOptions.editor.remove();
            }
        }

        function handelAfterRowsRendered(e) {
            if (isEditMode() == true) {
                var cellNode = view.getCellNodeById(editOptions.column.id, editOptions.row.id);
                if (cellNode) {
                    editOptions.editor.append(cellNode);
                    if (editOptions.addFocus == true) {
                        editOptions.addFocus = false;
                        editOptions.editor.focus();
                    }
                }
            }
        }

        function handleCellDblClick(e) {
            if (settings.edit.editOnClick == false) {
                editCellById(e.column.id, e.row.id);
            }
        }

        function handleCellClick(e) {
            if (settings.edit.editOnClick == true) {
                editCellById(e.column.id, e.row.id);
            }
        }

        function handeCellKeyDown(e) {
            //enter pressed
            if (e && e.event && e.event.keyCode == 13) {
                applyEdit();
            }
        }

        /*
        Public api
        */
        function editCellById(columnId, rowId) {
            if (isEditMode() == true) {
                if (editOptions.column.id != columnId || editOptions.row.id != rowId) {
                    applyEdit();
                }
            }

            if (isEditMode() == false) {

                var column = viewModel.getColumnById(columnId);
                var row = viewModel.getRowById(rowId);

                if (row && column && row.editable && column.editable && column.editor) {
                    editOptions = {
                        enabled: true,
                        addFocus: true,
                        row: row,
                        column: column,
                        editor: new settings.RowEditor.Create(
                            column.editor,
                            {
                                "value": row.item[column.field],
                            },
                            settings
                        ),
                    }

                    viewModel.columns.setColumnPropertyById(
                        column.id,
                        'editMode',
                        true
                    );

                    viewModel.rows.setRowPropertyById(
                        row.id,
                        'editMode',
                        true
                    );
                }
            }
        }


        function getEditor() {
            if (editOptions.enabled == true) {
                return editOptions.editor;
            }
        }

        function isEditMode() {
            return (editOptions.enabled == true);
        }

        function applyEdit() {
            if (editOptions.enabled == true) {

                viewModel.columns.setColumnPropertyById(
                    editOptions.column.id,
                    'editMode',
                    false
                );

                var row = viewModel.rows.getRowById(editOptions.row.id);
                if (row) {
                    row.item[editOptions.column.field] = editOptions.editor.getValue();
                    row.editMode = false;
                    viewModel.rows.updateItem(row);
                }

                //apply
                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                }
            }
            return this;
        }

        function cancelEdit() {
            if (editOptions.enabled == true) {
                //undo
                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                }
            }
            return this;
        }


        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "applyEdit": applyEdit,
            "cancelEdit": cancelEdit,
            "editCellById": editCellById,
            "getEditor": getEditor,
            "isEditMode": isEditMode,
        });

        init();
    }

})(jQuery);