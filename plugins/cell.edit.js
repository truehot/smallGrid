(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "CellEdit": CellEditPlugin,
            }
        }
    });

    function CellEditPlugin(context, settings) {
        var self = this;
        var view = context.view;
        var windowManager = context.windowManager;
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
            return self;
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
        function handleScrollStop(evt) {
            if (isEditMode() === true && settings.plugins.CellEdit.autoFocus === true) {
                if (view.isCellVisible(editOptions.column.id, editOptions.row.id)) {
                    editOptions.editor.focus();
                }
            }
        }

        function handleBeforeRowsRendered(evt) {
            if (isEditMode() === true) {
                editOptions.editor.remove();
            }
        }

        function handleAfterRowsRendered(evt) {
            if (isEditMode() === true) {
                var cellNode = view.getCellNodeById(editOptions.column.id, editOptions.row.id);
                if (cellNode) {
                    cellNode.className += " " + settings.cssClass.cellEdit;
                    editOptions.editor.append(cellNode);
                    if (editOptions.addFocusOnce === true) {
                        editOptions.addFocusOnce = false;
                        editOptions.editor.focus();
                    }
                }
            }
        }

        function handleCellDblClick(evt) {
            if (isEditMode() === true && evt.column.id == editOptions.column.id && evt.row.id == editOptions.row.id) {
                editOptions.editor.focus();
            }

            if (settings.plugins.CellEdit.editOnClick === false) {
                editCellById(evt.column.id, evt.row.id);
            }
        }

        function handleCellClick(evt) {
            if (isEditMode() === true && evt.column.id == editOptions.column.id && evt.row.id == editOptions.row.id) {
                editOptions.editor.focus();
            }

            if (settings.plugins.CellEdit.editOnClick === true) {
                editCellById(evt.column.id, evt.row.id);
            }
        }

        function handleCellKeyDown(evt) {
            if (evt && evt.event) {
                switch (evt.event.keyCode) {
                    case 13:
                        if (evt.event.target && evt.event.target.tagName != "TEXTAREA") {
                            applyEdit();
                        }
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
                    var request = view.suspendRender();

                    editOptions = {
                        enabled: true,
                        addFocusOnce: true,
                        row: row,
                        column: column,
                        editor: new SmallGrid.Cell.Editor.Create(
                            column.editor,
                            {
                                "row": row,
                                "column": column,
                                "value": row.item[column.field],
                                "windowManager": windowManager,
                                "settings": settings
                            },
                            settings
                        ),
                    }

                    self.onCellEdited.notify({
                        row: editOptions.row,
                        column: editOptions.column,
                        editor: editOptions.editor,
                    });

                    view.getModel().getColumnsModel().setColumnPropertyById(
                        column.id,
                        'editMode',
                        true
                    );

                    view.getModel().getRowsModel().setRowPropertyById(
                        row.id,
                        'editMode',
                        true
                    );

                    view.resumeRender(request);

                    if (SmallGrid.Utils.isFunction("append", editOptions.editor)) {
                        //view.render();
                    } else {
                        applyEdit();
                    }
                }
            }
        }

        function getEditor() {
            if (isEditMode() === true) {
                return editOptions.editor;
            }
        }

        function isEditMode() {
            return (editOptions.enabled === true);
        }

        function applyEdit() {
            if (isEditMode() === true) {
                var request = view.suspendRender();

                view.getModel().getColumnsModel().setColumnPropertyById(
                    editOptions.column.id,
                    'editMode',
                    false
                );

                var row = view.getModel().getRowsModel().getRowById(editOptions.row.id);
                if (row) {
                    row.item[editOptions.column.field] = editOptions.editor.getValue();
                    row.editMode = false;
                    view.getModel().getRowsModel().updateRow(row);
                }

                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                }
                view.resumeRender(request);
                //view.render();
            }
            return self;
        }

        function cancelEdit() {
            if (isEditMode() === true) {
                var request = view.suspendRender();

                view.getModel().getColumnsModel().setColumnPropertyById(
                    editOptions.column.id,
                    'editMode',
                    false
                );

                var row = view.getModel().getRowsModel().getRowById(editOptions.row.id);
                if (row) {
                    row.editMode = false;
                    view.getModel().getRowsModel().updateRow(row);
                }

                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                }
                view.resumeRender(request);
                //view.render();
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


            "onCellEdited": new SmallGrid.Event.Handler(),

        });
    }

})(jQuery);