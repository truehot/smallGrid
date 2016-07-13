(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "ColumnPickerMenu": ColumnPickerMenu
        }
    });

    function ColumnPickerMenu(context, settings) {
        var self = this;
        var currentId = "column-picker";

        /*
         * Init && destroy
         */
        function init() {
            context.view.onHeaderContextMenu.subscribe(handleHeaderContextMenu);
            return self;
        }

        function destroy() {
            context.view.onHeaderContextMenu.unsubscribe(handleHeaderContextMenu);
        }

        /*
         * Handlers
         */
        function handleHeaderContextMenu(evt) {

            if (evt && settings.plugins.ColumnPickerMenu.enabled === true) {
                evt.preventDefault();

                context.windowManager.hideWindows();
                if (context.windowManager.isWindow(currentId) === false) {
                    context.windowManager.createWindow(currentId, buildElements(currentId));
                } else {
                    var data = context.windowManager.getWindow(currentId);
                    if (data) {
                        data.container.empty().append(buildElements(currentId));
                    }
                }

                context.windowManager.showWindowNearPosition(
                    currentId,
                    {
                        x: evt.event.pageX,
                        y: evt.event.pageY
                    },
                    10
                );
            }
        }

        function buildElements(id) {
            var $element = $("<div class='grid-columnpicker-menu'></div>");
            var $content = $('<div class="grid-columnpicker-menucontent"></div>').appendTo($element);

            $element.on("click", { id: id }, handleMenuClick);
            $element.on("mouseenter", { id: id }, handleMenuMouseEnter);

            $(buildContent()).appendTo($content);
            return $element;
        }

        function buildContent() {
            var html = '';
            var columns = context.columnsModel.getColumns();
            var totalHidden = columns.length - totalHiddenColumns(columns);

            for (var i = 0, length = columns.length; i < length; i++) {
                html += '<div><label><input type="checkbox" name="" ' + (columns[i].hidden === true ? '' : ' checked ') + ' value="' + columns[i].id + '" ' + (totalHidden === 1 && columns[i].hidden === false ? ' disabled="disabled" ' : '') + '/> ' + columns[i].name + '</label></div>';
            }

            return html;
        }

        function totalHiddenColumns(columns) {
            var counter = 0;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].hidden === true) counter++;
            }
            return counter;
        }

        /*
         * Handlers
         */
        function handleMenuMouseEnter(evt) {
            $(this).off("mouseleave").on("mouseleave", function () {
                context.windowManager.hideWindow(evt.data.id);
            });

        }

        function handleMenuClick(evt) {
            evt.stopPropagation();
            if (evt.target) {
                var $checkbox = $(evt.target).closest('input');
                if ($checkbox.length) {
                    var columns = context.viewModel.getColumns();
                    var data;
                    var totalHidden = columns.length - totalHiddenColumns(columns);
                    if (totalHidden === 1 && $checkbox[0].checked === false) {
                        return false;
                    }

                    if (totalHidden === 1 && $checkbox[0].checked === true) {
                        //enable disabled checkbox
                        data = context.windowManager.getWindow(currentId);
                        if (data) {
                            data.container.find('input:disabled').removeAttr('disabled');
                        }
                    } else if (totalHidden === 2 && $checkbox[0].checked === false) {
                        //disable last checkbox
                        data = context.windowManager.getWindow(currentId);
                        if (data) {
                            var $checked = data.container.find('input:checked');
                            if ($checked.length) {
                                $checked.attr('disabled', 'disabled');
                            }
                        }
                    }

                    context.columnsModel.setColumnPropertyById($checkbox.val(), "hidden", !$checkbox[0].checked);
                }
            }
        }

        /*
         * Public API
         */
        function hideColumnById(id) {
            context.columnsModel.setColumnPropertyById(id, "hidden", true);
        }

        function hideColumnByIndex(idx) {
            context.columnsModel.setColumnPropertyByIndex(idx, "hidden", true);
        }

        function showColumnById(id) {
            context.columnsModel.setColumnPropertyById(id, "hidden", false);
        }

        function showColumnByIndex(idx) {
            context.columnsModel.setColumnPropertyByIndex(idx, "hidden", false);
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "hideColumnById": hideColumnById,
            "hideColumnByIndex": hideColumnByIndex,
            "showColumnById": showColumnById,
            "showColumnByIndex": showColumnByIndex
        });
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});