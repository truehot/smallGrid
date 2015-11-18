(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "ColumnPickerMenu": ColumnPickerMenu,
            }
        }
    });

    function ColumnPickerMenu(view, windowManager, settings) {
        var self = this;
        var currentId = "column-picker";
        function handleHeaderContextMenu(event) {

            if (event) {
                windowManager.hideWindows();
                if (windowManager.isWindow(currentId) === false) {
                    windowManager.createWindow(currentId, {}, buildElements(currentId));
                }
                windowManager.showWindowNearPosition(
                    currentId,
                    { x: event.event.pageX, y: event.event.pageY }
                );
            }
        }

        function buildElements(id) {
            var $element = $("<div class='grid-columnpicker-menu'></div>");
            var $form = $('<form>');
            var $content = $('<div class="grid-columnpicker-menucontent"></div>')
                .appendTo($form);

            $form.on("click", { id: id }, handleMenuClick);
            $form.appendTo($element);

            $(buildContent()).appendTo($content);

            return $element;
        }

        function buildContent() {
            var html = '';
            var columns = view.getModel().columns.getColumns();
            for (var i = 0; i < columns.length; i++) {
                html += '<div><label><input type="checkbox" name="" ' + ((columns[i].hidden) ? '' : ' checked ') + ' value="' + columns[i].id + '"/> ' + columns[i].name + '</label></div>';
            }
            return html;
        }

        /*
        Handlers
        */
        function handleMenuClick(event) {
            event.stopPropagation();
            if (event.target) {
                var $checkbox = $(event.target).closest('input');
                if ($checkbox.length) {
                    if (view.getModel().getColumns().length == 1 && $checkbox[0].checked == false) {
                        return false;
                    }

                    view.getModel().columns.setColumnPropertyById($checkbox.val(), "hidden", !$checkbox[0].checked);
                }
            }
        }

        /*
        Init && destroy
        */
        function init() {
            view.onHeaderContextMenu.subscribe(handleHeaderContextMenu);
            return self;
        }

        function destroy() {
            view.onHeaderContextMenu.unsubscribe(handleHeaderContextMenu);
        }


        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });
    }

})(jQuery);