if (typeof jQuery === "undefined") {
    throw new Error("Small grid requires jquery module to be loaded.");
}
if (typeof SmallGrid === "undefined") {
    throw new Error("Small grid required to be loaded.");
}

(function ($, SmallGrid) {
    "use strict";
    var defaultSettings = {
        renderDelay: 0,
        showLastColumn: true,//show last column
        uidPrefix: "smallgrid_",
        maxSupportedCssHeight: undefined,//internal
        scrollbarDimensions: undefined,//internal
        cellOuterSize: undefined,//internal
        uid: undefined,//internal
        cssClass: {
            disableTextSelection: "disable-text-selection",
            cell: "grid-cell",
            cellEdit: "grid-cell-edit",
            cellColumnLast: "grid-cell-column-last",
            cellRowLast: "grid-cell-row-last",
            col: "grid-col",
            collLast: "grid-coll-last",
            cursorPointer: "grid-cursor-pointer",
            cursorResize: "grid-cursor-resize disable-text-selection",
            headerCell: "grid-header-cell",
            headerCellDiv: "grid-header-cell-div",
            headerColumnName: "grid-column-name",
            headerFilter: "grid-header-filter",
            headerFilterActive: "grid-header-filter-active",
            headerResizeHandle: "grid-resizable-handle",
            headerRow: "grid-header-row",
            headerSortable: "grid-sortable",
            headerSortDown: "grid-sort-icon grid-sort-icon-desc",
            headerSortUp: "grid-sort-icon grid-sort-icon-asc",
            row: "grid-row",
            rowEven: "grid-row-even",
            rowOdd: "grid-row-odd",
            rowSelected: "grid-row-selected",
            rowValignMiddle: "grid-row-valign-middle",
            rowValignTop: "grid-row-valign-top",
            rowValignBottom: "grid-row-valign-bottom",
            rowValignBaseline: "grid-row-valign-baseline",
            cellAlignCenter: "grid-cell-align-center",
            cellAlignRight: "grid-cell-align-right"
        },
        header: {
            height: 20,
            disableTextSelection: true
        },

        columns: {
            idProperty: undefined,
            newIdType: "",//number, guid
        },
        rows: {
            disableTextSelection: false,
            idProperty: undefined,//TODO: other fields mapping
            newIdType: "",//number, guid
            valign: "" //middle, top, bottom, baseline
        },
        formatter: {
            floatFormatter: {
                decimals: 2
            },
            integerFormatter: {
                decimals: 0
            },
            moneyFormatter: {
                locales: 'en-US',
                options: {
                    currency: 'EUR',
                    style: 'currency'
                }
            },
            dateFormatter: {
                locales: 'en-US',
                options: {}
            }
        },

        plugins: {
            AutoResize: {
                enabled: true,
                resizeOnce: true//resize columns when view loaded to fit canvas
            },
            ColumnSort: {},
            ColumnResize: {},
            RowSelection: {
                multipleRowSelection: false//allow multiplerow selection
            },
            CellEdit: {
                editOnClick: false,//when true, editor loaded after click
                autoFocus: true//autofocus edited cell when scrolling
            },
            ColumnFilterMenu: {},
            ColumnPickerMenu: {}
        }
    };

    function CreateSettings(opts) {

        var settings = $.extend(true, {}, defaultSettings, opts || {});

        if (settings.maxSupportedCssHeight === undefined) {
            defaultSettings.maxSupportedCssHeight = settings.maxSupportedCssHeight = SmallGrid.Utils.measureMaxSupportedCssHeight();
        }

        if (settings.scrollbarDimensions === undefined) {
            defaultSettings.scrollbarDimensions = settings.scrollbarDimensions = SmallGrid.Utils.measureScrollbar();
        }

        if (settings.cellOuterSize === undefined) {
            settings.cellOuterSize = SmallGrid.Utils.measureCellDiff(settings.cssClass.cell);
        }

        if (settings.uid === undefined) {
            settings.uid = SmallGrid.Utils.createGuid();
        }

        return settings;
    }

    $.extend(true, SmallGrid, {
        "Settings": {
            "Create": CreateSettings,
            "Default": defaultSettings
        }
    });
})(jQuery, window.SmallGrid = window.SmallGrid || {});