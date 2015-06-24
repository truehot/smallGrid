"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "Handler": {
                "Click": ClickHandler
            }
        }
    });

    var defaultSettings = {
        "rowIdentifier": "TR",
        "cellIdentifier": "TD",
        "handleClick": undefined,
        "handleDblClick": undefined,
        "handleContextMenu": undefined,
        "handleKeyDown": undefined,
    }

    function ClickHandler($container, settings) {
        var settings = jQuery.extend({}, defaultSettings, settings);

        $container
            .on("click", handleClick)
            .on("contextmenu", handleContextMenu)
            .on("dblclick", handleDblClick)
            .on("keydown", handleKeyDown);

        function getCellEvent(e) {
            if (e && e.target) {
                var $cellElement = $(e.target).closest(settings.cellIdentifier);
                if ($cellElement.length) {
                    var $rowElement = $cellElement.closest(settings.rowIdentifier);
                    if ($rowElement.length) {
                        return {
                            cellIndex: $cellElement.index(),
                            rowIndex: $rowElement.index(),
                            event: e,
                        }
                    }
                }
            }
        }

        function handleClick(e) {
            var event = getCellEvent(e);
            if (event && settings.handleClick) {
                settings.handleClick(event);
            }
        }

        function handleContextMenu(e) {
            var event = getCellEvent(e);
            if (event && settings.handleContextMenu) {
                settings.handleContextMenu(event);
            }
        }

        function handleDblClick(e) {
            var event = getCellEvent(e);
            if (event && settings.handleDblClick) {
                settings.handleDblClick(event);
            }
        }

        function handleKeyDown(e) {
            var event = getCellEvent(e);
            if (event && settings.handleKeyDown) {
                settings.handleKeyDown(event);
            }
        }

        function destroy() {
            $container
                .off("click", handleClick)
                .off("contextmenu", handleContextMenu)
                .off("dblclick", handleDblClick)
                .off("keydown", handleKeyDown);
        }

        $.extend(this, {
            "destroy": destroy
        });
    };

})(jQuery);