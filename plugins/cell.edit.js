(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "CellEdit": CellEditPlugin
        }
    });

    function CellEditPlugin(context, settings) {
        var self = this;

        var editOptions = {
            enabled: false
        };

        function init() {
            //register plugin settings
            if (!settings.plugins.CellEdit) {
                settings.plugins.CellEdit = {
                    enabled: false,
                    editOnClick: false,//when true, editor loaded after click
                    autoFocus: true//autofocus edited cell when scrolling
                };
            }

            context.view.onAfterRowsRendered.subscribe(handleAfterRowsRendered);
            context.view.onBeforeRowsRendered.subscribe(handleBeforeRowsRendered);
            context.view.onCellClick.subscribe(handleCellClick);
            context.view.onCellDblClick.subscribe(handleCellDblClick);
            context.view.onCellKeyDown.subscribe(handleCellKeyDown);
            context.view.onScrollStop.subscribe(handleScrollStop);

            context.view.getBuilder().onCellCss.subscribe(buildCellCss);

            return self;
        }

        function destroy() {
            context.view.onAfterRowsRendered.unsubscribe(handleAfterRowsRendered);
            context.view.onBeforeRowsRendered.unsubscribe(handleBeforeRowsRendered);
            context.view.onCellClick.unsubscribe(handleCellClick);
            context.view.onCellDblClick.unsubscribe(handleCellDblClick);
            context.view.onCellKeyDown.unsubscribe(handleCellKeyDown);
            context.view.onScrollStop.unsubscribe(handleScrollStop);

            context.view.getBuilder().onCellCss.unsubscribe(buildCellCss);

            cancelEdit();
        }

        /*
         * Handlers
         */

        function buildCellCss(cellCssClass, args) {
            if (args.row.editMode === true && args.column.editMode === true) {
                cellCssClass.push(settings.cssClass.cellEdit);
            } else {
                switch (args.column.editor) {
                    case "Date":
                        cellCssClass.push("grid-date-icon-formatter");
                        break;
                    case "Checkbox":
                        break;
                    case "Float":
                    case "Integer":
                    case "Text":
                        cellCssClass.push("grid-text-icon-formatter");
                        break;
                    case "Select":
                        cellCssClass.push("grid-select-icon-formatter");
                        break;
                }
            }

            return cellCssClass;
        }

        function handleScrollStop(evt) {
            if (isEditMode() === true && settings.plugins.CellEdit.autoFocus === true && settings.plugins.CellEdit.enabled === true) {
                if (context.view.isCellVisible(editOptions.column.id, editOptions.row.id)) {
                    editOptions.editor.focus();
                }
            }
        }

        function handleBeforeRowsRendered(evt) {
            if (isEditMode() === true && settings.plugins.CellEdit.enabled === true) {
                editOptions.editor.remove();
            }
        }

        function handleAfterRowsRendered(evt) {
            if (isEditMode() === true && settings.plugins.CellEdit.enabled === true) {
                var cellNode = context.view.getCellNodeById(editOptions.column.id, editOptions.row.id);
                if (cellNode) {
                    editOptions.editor.append(cellNode);
                    if (editOptions.addFocusOnce === true) {
                        editOptions.addFocusOnce = false;
                        editOptions.editor.focus();
                    }
                }
            }
        }

        function handleCellDblClick(evt) {
            if (settings.plugins.CellEdit.enabled !== true) return;
            if (isEditMode() === true && evt.column.id === editOptions.column.id && evt.row.id === editOptions.row.id) {
                editOptions.editor.focus();
            }

            if (settings.plugins.CellEdit.editOnClick === false) {
                editCellById(evt.column.id, evt.row.id);
            }
        }

        function handleCellClick(evt) {
            if (settings.plugins.CellEdit.enabled !== true) return;
            if (isEditMode() === true && evt.column.id === editOptions.column.id && evt.row.id === editOptions.row.id) {
                editOptions.editor.focus();
            }

            if (settings.plugins.CellEdit.editOnClick === true) {
                editCellById(evt.column.id, evt.row.id);
            }
        }

        function handleCellKeyDown(evt) {
            if (evt && evt.event && settings.plugins.CellEdit.enabled === true) {
                switch (evt.event.keyCode) {
                    case 13:
                        if (evt.event.target && evt.event.target.tagName !== "TEXTAREA") {
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
         * Public api
         */
        function editCellById(columnId, rowId) {
            if (isEditMode() === true) {
                if (editOptions.column.id !== columnId || editOptions.row.id !== rowId) {
                    applyEdit();
                }
            }

            if (isEditMode() === false) {
                var column = context.viewModel.getColumnById(columnId);
                var row = context.viewModel.getRowById(rowId);
                if (row && column && row.editable && column.editable && column.editor) {
                    var request = context.view.suspendRender();

                    editOptions = {
                        enabled: true,
                        addFocusOnce: true,
                        row: row,
                        column: column,
                        editor: SmallGrid.Cell.Editor.Create(
                            column.editor,
                            {
                                "row": row,
                                "column": column,
                                "value": row.item[column.field],
                                "windowManager": context.windowManager,
                                "settings": settings
                            },
                            settings
                        )
                    };

                    self.onCellEdited.notify({
                        row: editOptions.row,
                        column: editOptions.column,
                        editor: editOptions.editor
                    });

                    context.columnsModel.setColumnPropertyById(
                        column.id,
                        'editMode',
                        true
                    );

                    context.rowsModel.setRowPropertyById(
                        row.id,
                        'editMode',
                        true
                    );

                    var cellNode = context.view.getCellNodeById(column.id, row.id);
                    if (cellNode) {
                        cellNode.className += ' ' + settings.cssClass.cellEdit;
                        cellNode.innerHTML = '';
                    }

                    context.view.resumeRender(request);

                    if (SmallGrid.Utils.isFunction("append", editOptions.editor) === false) {
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
            return editOptions.enabled === true;
        }

        function applyEdit() {
            if (isEditMode() === true) {
                var request = context.view.suspendRender();

                var column = context.columnsModel.getColumnById(editOptions.column.id);
                var row = context.rowsModel.getRowById(editOptions.row.id);
                if (column && row) {
                    column.editMode = false;
                    context.columnsModel.updateColumn(column);

                    row.item[editOptions.column.field] = editOptions.editor.getValue();
                    row.editMode = false;
                    context.rowsModel.updateRow(row);

                    var cellNode = context.view.getCellNodeById(editOptions.column.id, editOptions.row.id);
                    if (cellNode) {
                        cellNode.className = cellNode.className.replace(' ' + settings.cssClass.cellEdit, '');
                        cellNode.innerHTML = context.view.getBuilder().buildCellContentHtml(column, row);
                    }
                }

                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                };
                context.view.resumeRender(request);
            }
            return self;
        }

        function cancelEdit() {
            if (isEditMode() === true) {
                var request = context.view.suspendRender();

                var column = context.columnsModel.getColumnById(editOptions.column.id);
                var row = context.rowsModel.getRowById(editOptions.row.id);
                if (column && row) {
                    column.editMode = false;
                    context.columnsModel.updateColumn(column);

                    row.editMode = false;
                    context.rowsModel.updateRow(row);

                    var cellNode = context.view.getCellNodeById(editOptions.column.id, editOptions.row.id);
                    if (cellNode) {
                        cellNode.className = cellNode.className.replace(' ' + settings.cssClass.cellEdit, '');
                        cellNode.innerHTML = context.view.getBuilder().buildCellContentHtml(column, row);
                    }
                }

                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                };
                context.view.resumeRender(request);
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

            "onCellEdited": SmallGrid.Callback.Create()

        });
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});