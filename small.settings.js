"use strict";
if (typeof jQuery === "undefined") {
    throw "Small grid requires jquery module to be loaded";
}

(function ($) {


    function getNamespaceFromString(namespace) {
        var ref = window;
        var namespaceParts = namespace.split(".");
        for (var i = 0; i < namespaceParts.length; ++i) {
            ref = ref[namespaceParts[i]];
        }
        return ref;
    }

    function loadShortcuts(settings) {
        for (var shortcut in shortcuts) {
            var namespace = getNamespaceFromString(shortcuts[shortcut])
            if (namespace) {
                settings[shortcut] = namespace;
            }
        }
    }

    var shortcuts = {
        Event: "Small.Event",
        HandlerClick: "Small.Handler.Click",
        HandlerResize: "Small.Handler.Resize",
        HandlerScroll: "Small.Handler.Scroll",
        Plugins: "Small.Plugins",
        RowComparer: "Small.Row.Comparer",
        Filter: "Small.Filter",
        RowEditor: "Small.Cell.Editor",
        RowFormatter: "Small.Cell.Formatter",
        Utils: "Small.Utils",
        View: "Small.View",
    }

    var defaultSettings = {
        maxSupportedCssHeight: undefined,//internal
        scrollbarDimensions: undefined,//internal
        explicitInitialization: false,
        uid: undefined,
        uidPrefix: "smallgrid_",
        allowMultiRowSelection: false,//allow multirow selection
        edit: {
            editOnClick: false,//when true, editor loaded after click
            autoFocus: true,//autofocus editor when scrolling
        },

        cssClass: {
            cell: "grid-td grid-td-div",
            col: "grid-col",
            cursorPointer: "grid-cursor-pointer",
            cursorResize: "grid-cursor-resize",
            headerCell: "grid-header-cell",
            headerColumnName: "grid-column-name",
            headerFilter: "grid-header-filter",
            headerResizeHandle: "grid-resizable-handle",
            headerRow: "grid-header-row",
            headerRowDiv: "grid-header-td-div",
            headerSortable: "grid-sortable",
            headerSortDown: "grid-sort-icon grid-sort-icon-desc",
            headerSortUp: "grid-sort-icon grid-sort-icon-asc",
            row: "grid-tr",
            rowEven: "grid-tr-even",
            rowOdd: "grid-tr-odd",
            rowSelected: "grid-row-selected"
        },

        columns: {
            idProperty: undefined,
            mapProperties: true,
            header: {
                height: 20,
            },
        },

        rows: {
            idProperty: undefined,//TODO: other fields mapping
            mapProperties: true,
            formatter: undefined,//todo: remove?
            editable: true,
            selectable: true,
        },

        formatter: {
            floatFormatter: {
                decimals: 2,
            },
            integerFormatter: {
                decimals: 2,
            },
        },

        plugins: [
            "ColumnSort",
            "ColumnResize",
            "RowSelection",
            "CellEdit",
            "Filter",
        ]
    }



    function CreateObj(settings) {

        var settings = jQuery.extend(true, defaultSettings, settings);

        if (settings['maxSupportedCssHeight'] == undefined) {
            defaultSettings['maxSupportedCssHeight'] = settings['maxSupportedCssHeight'] = settings.Utils.measureMaxSupportedCssHeight()
        }
        if (settings['scrollbarDimensions'] == undefined) {
            defaultSettings['scrollbarDimensions'] = settings['scrollbarDimensions'] = settings.Utils.measureScrollbar()
        }

        settings.uid = settings.uid || settings.Utils.getNewGuid();
        return settings;
    }

    loadShortcuts(defaultSettings);

    $.extend(true, window, {
        "Small": {
            "Settings": {
                "Create": CreateObj,
                "Default": defaultSettings,
            }
        }
    });
})(jQuery);