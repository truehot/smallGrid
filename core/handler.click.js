(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Handler": {
                "Click": {
                    "Create": Create,
                    "Handler": ClickHandler,
                }
            }
        }
    });

    function ClickHandler($container, settings) {
        $container
            .on("click", handleClick)
            .on("mousedown", handleMouseDown)
            .on("contextmenu", handleContextMenu)
            .on("dblclick", handleDblClick)
            .on("keydown", handleKeyDown);

        function getCellEvent(event) {
            if (event && event.target) {
                var $cellElement = $(event.target).closest(settings.cellIdentifier);
                if ($cellElement.length) {
                    var $rowElement = $cellElement.closest(settings.rowIdentifier);
                    if ($rowElement.length) {
                        return {
                            cellIndex: $cellElement.index(),
                            rowIndex: $rowElement.index(),
                            event: event,
                        };
                    }
                }
            }
        }

        function handleMouseDown(event) {
            if (event.ctrlKey || event.shiftKey) {
                document.getSelection().removeAllRanges();
                event.preventDefault();
            }
        }

        function handleClick(event) {
            event = getCellEvent(event);
            if (event && settings.handleClick) {
                settings.handleClick(event);
            }
        }

        function handleContextMenu(event) {
            event = getCellEvent(event);
            if (event && settings.handleContextMenu) {
                settings.handleContextMenu(event);
            }
            return false;
        }

        function handleDblClick(event) {
            event = getCellEvent(event);
            if (event && settings.handleDblClick) {
                settings.handleDblClick(event);
            }
        }

        function handleKeyDown(event) {
            event = getCellEvent(event);
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
    }

    function Create($container, settings) {
        var defaultSettings = {
            "rowIdentifier": "TR",
            "cellIdentifier": "TD",
            "handleClick": undefined,
            "handleDblClick": undefined,
            "handleContextMenu": undefined,
            "handleKeyDown": undefined,
        };

        settings = $.extend({}, defaultSettings, settings);

        return new ClickHandler($container, settings);
    }

})(jQuery);