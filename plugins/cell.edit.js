(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "CellEdit": CellEditPlugin,
            }
        }
    });


    function CellEditPlugin(view, windowManager, settings) {
        var self = this;
        var editOptions = {
            enabled: false
        };

        function init() {
            view.onAfterRowsRendered.subscribe(handleAfterRowsRendered);
            view.onBeforeRowsRendered.subscribe(handleBeforeRowsRendered);
            view.onCellClick.subscribe(handleCellClick);
            view.onCellDblClick.subscribe(handleCellDblClick);
            view.onCellKeyDown.subscribe(handleCellKeyDown);
            view.onScrollStop.subscribe(handleScrollStop);
        }

        function destroy() {
            view.onAfterRowsRendered.unsubscribe(handleAfterRowsRendered);
            view.onBeforeRowsRendered.unsubscribe(handleBeforeRowsRendered);
            view.onCellClick.unsubscribe(handleCellClick);
            view.onCellDblClick.unsubscribe(handleCellDblClick);
            view.onCellKeyDown.unsubscribe(handleCellKeyDown);
            view.onScrollStop.unsubscribe(handleScrollStop);
        }

        /*
         Handlers
         */
        function handleScrollStop(event) {
            if (isEditMode() === true && settings.plugins.CellEdit.autoFocus === true) {
                if (view.isCellVisible(editOptions.column.id, editOptions.row.id)) {
                    editOptions.editor.focus();
                }
            }
        }

        function handleBeforeRowsRendered(event) {
            if (isEditMode() === true) {
                editOptions.editor.remove();
            }
        }

        function handleAfterRowsRendered(event) {
            if (isEditMode() === true) {
                var cellNode = view.getCellNodeById(editOptions.column.id, editOptions.row.id);
                if (cellNode) {
                    cellNode.className += " " + settings.cssClass.cellEdit;
                    editOptions.editor.append(cellNode);
                    if (editOptions.addFocus === true) {
                        editOptions.addFocus = false;
                        editOptions.editor.focus();
                    }
                }
            }
        }

        function handleCellDblClick(event) {
            if (settings.plugins.CellEdit.editOnClick === false) {
                editCellById(event.column.id, event.row.id);
            }
        }

        function handleCellClick(event) {
            if (settings.plugins.CellEdit.editOnClick === true) {
                editCellById(event.column.id, event.row.id);
            }
        }

        function handleCellKeyDown(event) {
            if (event && event.event) {
                switch (event.event.keyCode) {
                    case 13:
                        applyEdit();
                        break;
                    case 27:
                        cancelEdit();
                        break;
                }
            }
        }

        /*
        Public api
        */
        function editCellById(columnId, rowId) {
            if (isEditMode() === true) {
                if (editOptions.column.id != columnId || editOptions.row.id != rowId) {
                    applyEdit();
                }
            }

            if (isEditMode() === false) {
                var column = view.getModel().getColumnById(columnId);
                var row = view.getModel().getRowById(rowId);
                if (row && column && row.editable && column.editable && column.editor) {
                    editOptions = {
                        enabled: true,
                        addFocus: true,
                        row: row,
                        column: column,
                        editor: new SmallGrid.Cell.Editor.Create(
                            column.editor,
                            {
                                "value": row.item[column.field],
                            },
                            settings
                        ),
                    }

                    view.getModel().columns.setColumnPropertyById(
                        column.id,
                        'editMode',
                        true
                    );

                    view.getModel().rows.setRowPropertyById(
                        row.id,
                        'editMode',
                        true
                    );

                }
            }
        }


        function getEditor() {
            if (editOptions.enabled === true) {
                return editOptions.editor;
            }
        }

        function isEditMode() {
            return (editOptions.enabled === true);
        }

        function applyEdit() {
            if (editOptions.enabled === true) {
                var request = view.suspendRender();

                view.getModel().columns.setColumnPropertyById(
                    editOptions.column.id,
                    'editMode',
                    false
                );

                var row = view.getModel().rows.getRowById(editOptions.row.id);
                if (row) {
                    row.item[editOptions.column.field] = editOptions.editor.getValue();
                    row.editMode = false;
                    view.getModel().rows.updateRow(row);
                }

                //apply
                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                }
                view.resumeRender(request);
                view.render();
            }
            return self;
        }

        function cancelEdit() {
            if (editOptions.enabled === true) {
                var request = view.suspendRender();
                view.getModel().columns.setColumnPropertyById(
                    editOptions.column.id,
                    'editMode',
                    false
                );

                var row = view.getModel().rows.getRowById(editOptions.row.id);
                if (row) {
                    row.editMode = false;
                    view.getModel().rows.updateRow(row);
                }

                //undo
                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                }
                view.resumeRender(request);
                view.render();
            }
            return self;
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
    }

})(jQuery);