(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Handler": {
            "Click": {
                "Create": Create,
                "Handler": ClickHandler
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
                            event: evt
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
            var cellEvt = getCellEvent(evt);
            if (cellEvt && settings.handleClick) {
                settings.handleClick(cellEvt);
            }
        }

        function handleContextMenu(evt) {
            var cellEvt = getCellEvent(evt);
            if (cellEvt && settings.handleContextMenu) {
                settings.handleContextMenu(cellEvt);
            }
        }

        function handleDblClick(evt) {
            var cellEvt = getCellEvent(evt);
            if (cellEvt && settings.handleDblClick) {
                settings.handleDblClick(cellEvt);
            }
        }

        function handleKeyDown(evt) {
            var cellEvt = getCellEvent(evt);
            if (cellEvt && settings.handleKeyDown) {
                settings.handleKeyDown(cellEvt);
            }
        }

        function destroy() {
            $container
                .off("click", handleClick)
                .off("mousedown", handleMouseDown)
                .off("contextmenu", handleContextMenu)
                .off("dblclick", handleDblClick)
                .off("keydown", handleKeyDown);

            var settingsKeys = Object.keys(settings);
            for (var i = 0; i < settingsKeys.length; i++) {
                delete settings[settingsKeys[i]];
            }
        }

        $.extend(this, {
            "destroy": destroy
        });
    }

    function Create($container, options) {
        if (!$container.length) {
            throw new TypeError("Container is not defined or does not exist in the DOM.");
        }

        if ($container.length != 1) {
            throw new TypeError("There should be only 1 container.");
        }

        var defaultSettings = {
            "rowIdentifier": "TR",
            "cellIdentifier": "TD",
            "handleClick": undefined,
            "handleDblClick": undefined,
            "handleContextMenu": undefined,
            "handleKeyDown": undefined
        };

        var settings = $.extend({}, defaultSettings, options);

        return new ClickHandler($container, settings);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});