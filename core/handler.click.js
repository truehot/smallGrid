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

        function getCellEvent(evt) {
            if (evt && evt.target) {
                var $cellElement = $(evt.target).closest(settings.cellIdentifier);
                if ($cellElement.length) {
                    var $rowElement = $cellElement.closest(settings.rowIdentifier);
                    if ($rowElement.length) {
                        return {
                            cellIndex: $cellElement.index(),
                            rowIndex: $rowElement.index(),
                            event: evt,
                        };
                    }
                }
            }
        }

        function handleMouseDown(evt) {
            if (evt.ctrlKey || evt.shiftKey) {
                document.getSelection().removeAllRanges();
                evt.preventDefault();
            }
        }

        function handleClick(evt) {
            evt = getCellEvent(evt);
            if (evt && settings.handleClick) {
                settings.handleClick(evt);
            }
        }

        function handleContextMenu(evt) {
            evt = getCellEvent(evt);
            if (evt && settings.handleContextMenu) {
                settings.handleContextMenu(evt);
            }
        }

        function handleDblClick(evt) {
            evt = getCellEvent(evt);
            if (evt && settings.handleDblClick) {
                settings.handleDblClick(evt);
            }
        }

        function handleKeyDown(evt) {
            evt = getCellEvent(evt);
            if (evt && settings.handleKeyDown) {
                settings.handleKeyDown(evt);
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