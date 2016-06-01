(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "ColumnPickerMenu": ColumnPickerMenu,
            }
        }
    });

    function ColumnPickerMenu(context, settings) {
        var self = this;
        var currentId = "column-picker";
        var view = context.view;
        var windowManager = context.windowManager;

        function handleHeaderContextMenu(evt) {

            if (evt) {
                evt.preventDefault();

                windowManager.hideWindows();
                if (windowManager.isWindow(currentId) === false) {
                    windowManager.createWindow(currentId, buildElements(currentId));
                } else {
                    var data = windowManager.getWindow(currentId);
                    if (data) {
                        data.container.empty().append(buildElements(currentId));
                    }
                }

                windowManager.showWindowNearPosition(
                    currentId,
                    {
                        x: evt.event.pageX,
                        y: evt.event.pageY
                    },
                    5
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
            var columns = view.getModel().getColumnsModel().getColumns();
            for (var i = 0; i < columns.length; i++) {
                html += '<div><label><input type="checkbox" name="" ' + ((columns[i].hidden) ? '' : ' checked ') + ' value="' + columns[i].id + '"/> ' + columns[i].name + '</label></div>';
            }
            return html;
        }

        function checkHiddenColumns(columns) {
            var counter = 0;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].hidden === false) counter++;
                if (counter > 1) return true;
            }
            return false;
        }

        /*
        Handlers
        */
        function handleMenuMouseEnter(evt) {
            $(this).off("mouseleave").on("mouseleave", function () {
                windowManager.hideWindow(evt.data.id);
            });

        }

        function handleMenuClick(evt) {
            evt.stopPropagation();
            if (evt.target) {
                var $checkbox = $(evt.target).closest('input');
                if ($checkbox.length) {
                    if (checkHiddenColumns(view.getModel().getColumns()) === false && $checkbox[0].checked == false) {
                        return false;
                    }
                    view.getModel().getColumnsModel().setColumnPropertyById($checkbox.val(), "hidden", !$checkbox[0].checked);
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