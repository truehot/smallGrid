(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "View": {
                "Renderer": {
                    "Create": Create,
                    "Renderer": Renderer,
                }
            }
        }
    });

    function Renderer(settings) {
        var self = this;

        /*
        Structure
        */
        function buildViewPortElements($container) {
            var el = {
                'container': $container,
                'content': null,
                'contentCol': null,
                'contentTable': null,
                'contentTbody': null,
                'contentWrap': null,
                'footer': null,
                'header': null,
                'headerCol': null,
                'headerTable': null,
                'headerTbody': null,
                'headerWrap': null,
                'viewport': null,
            };

            //create
            el['viewport'] = $("<div class='small-grid grid-viewport'/>");
            el['header'] = $("<div class='grid-header'/>");
            el['content'] = $("<div class='grid-content'/>");
            el['footer'] = $("<div class='grid-footer'/>");

            el['headerCol'] = $("<colgroup></colgroup>");
            el['headerTable'] = $("<table class='grid-header-table'></table>");
            el['headerTbody'] = $("<tbody></tbody>");
            el['headerWrap'] = $("<div class='grid-header-wrap'/>");

            el['contentCol'] = $("<colgroup></colgroup>");
            el['contentTable'] = $("<table class='grid-content-table'></table>");
            el['contentTbody'] = $("<tbody></tbody>");
            el['contentWrap'] = $("<div class='grid-content-wrap'/>");

            //header part
            el['headerCol'].appendTo(el['headerTable']);
            el['headerTbody'].appendTo(el['headerTable']);
            el['headerTable'].appendTo(el['headerWrap']);
            el['headerWrap'].appendTo(el['header']);

            //content part
            el['contentCol'].appendTo(el['contentTable']);
            el['contentTbody'].appendTo(el['contentTable']);
            el['contentTable'].appendTo(el['contentWrap']);
            el['contentWrap'].appendTo(el['content']);

            //main structure
            el['header'].appendTo(el['viewport']);
            el['content'].appendTo(el['viewport']);
            el['footer'].appendTo(el['viewport']);

            if (settings.header.disableTextSelection) {
                el['header'].addClass(settings.cssClass.disableTextSelection);
            }

            if (settings.rows.disableTextSelection) {
                el['content'].addClass(settings.cssClass.disableTextSelection);
            }

            return el;
        }

        /*
        Header columns
        */
        function buildHeaderColumnsHtml(columns, opts) {
            var html = "<tr class='" + settings.cssClass.headerRow + "'>";
            for (var i = 0, length = columns.length - 1; i <= length; i++) {
                html += buildHeaderColumnHtml(columns[i], opts, length == i);
            }

            if (opts.virtualColumnWidth > 0) {
                html += buildLastHeaderColumn(columns[i - 1], opts);
            }

            return html + "</tr>";
        }

        function buildHeaderColumnHtml(column, opts, isLast) {
            var value = "",
                html,
                cellCssClass = settings.cssClass.headerCell;

            if (column.headerCssClass) {
                cellCssClass += " " + column.headerCssClass;
            }

            if (isLast && opts.hideColumnBorder) {
                cellCssClass += " " + settings.cssClass.cellLast;
            }
            //TODO: replace
            switch (column.align) {
                case "center":
                    cellCssClass += " " + settings.cssClass.cellAlignCenter;
                    break;
                case "right":
                    cellCssClass += " " + settings.cssClass.cellAlignRight;
                    break;
            }

            //TODO: add formatter
            if (column.name) {
                value += column.name;
            }

            if (column.sortable || column.filterable) {
                cellCssClass += " " + settings.cssClass.cursorPointer;
            }

            html = "<td style='width:" + (column.width + settings.cellOuterSize.width) + "px;height:" + settings.header.height + "px' class='" + cellCssClass + "'><div class='" + settings.cssClass.headerCellDiv + "'><span class='" + settings.cssClass.headerColumnName + "'>" + value + "</span>";


            if (column.sortable && column.sortOrder !== 0) {
                html += "<span class='" + ((column.sortOrder == 1) ? settings.cssClass.headerSortUp : settings.cssClass.headerSortDown) + "'></span>";
            }

            if (column.filterable) {
                html += "<span class='" + settings.cssClass.headerFilter + "'></span>";
            }

            html += "</div>";

            if (column.resizeable) {
                html += "<span class='" + settings.cssClass.headerResizeHandle + "'></span>";
            }

            return html + "</td>";
        }

        function buildLastHeaderColumn(column, opts) {
            return "<td class='" + settings.cssClass.headerCell + ' ' + settings.cssClass.cellLast + "' style='height:" + settings.header.height + "px'></td>";
        }

        /*
        Cols
        */
        function buildColsHtml(columns, opts) {
            var html = '';
            for (var i = 0, length = columns.length; i < length; i++) {
                html += buildColHtml(columns[i]);
            }

            if (opts.virtualColumnWidth > 0) {
                html += buildLastColHtml(columns[i - 1], opts);
            }

            return html;
        }

        function buildColHtml(column) {
            var cellCssClass = settings.cssClass.col;
            if (column.headerCssClass) {
                cellCssClass += " " + column.headerCssClass;
            }

            return "<col style='width:" + (column.width + settings.cellOuterSize.width) + "px;' class='" + cellCssClass + "'/>";
        }

        function buildLastColHtml(column, opts) {
            return "<col style='width:" + opts.virtualColumnWidth + "px;' class='" + settings.cssClass.col + " " + settings.cssClass.collLast + "'/>";
        }

        /*
        Rows
        */
        function buildRowsHtml(columns, rows, opts) {
            var html = '';
            for (var i = 0, length = rows.length; i < length; i++) {
                html += buildRowHtml(columns, rows[i], opts);
            }
            return html;
        }

        function buildRowHtml(columns, row, opts) {
            var rowCssClass = settings.cssClass.row + ((row.calcIndex & 1 == 1) ? " " + settings.cssClass.rowEven : " " + settings.cssClass.rowOdd);

            if (row.rowCssClass) rowCssClass += " " + row.rowCssClass;

            //TODO: remove / replace
            switch (settings.rows.valign) {
                case "middle":
                    rowCssClass += " " + settings.cssClass.rowValignMiddle;
                    break;
                case "top":
                    rowCssClass += " " + settings.cssClass.rowValignTop;
                    break;
                case "bottom":
                    rowCssClass += " " + settings.cssClass.rowValignBottom;
                    break;
                case "baseline":
                    rowCssClass += " " + settings.cssClass.rowValignBaseline;
                    break;
            }

            var html = "<tr class='" + rowCssClass + "'>";
            for (var i = 0, length = columns.length - 1; i <= length; i++) {
                html += buildCellHtml(columns[i], row, opts, length == i);
            }

            if (opts.virtualColumnWidth > 0) {
                html += buildLastCellHtml(columns[i - 1], opts);
            }


            return html + '</tr>';
        }

        function buildCellHtml(column, row, opts, isLast) {
            var cellCssClass = settings.cssClass.cell;
            if (column.cellCssClass) {
                cellCssClass += " " + column.cellCssClass;
            }

            if (isLast && opts.hideColumnBorder) {
                cellCssClass += " " + settings.cssClass.cellLast;
            }

            //TODO: remove/replace
            if (column.align == "center") {
                cellCssClass += " " + settings.cssClass.cellAlignCenter;
            }
            //TODO: remove/replace
            if (column.align == "right") {
                cellCssClass += " " + settings.cssClass.cellAlignRight;
            }

            if (row.cellCssClass && column.field in row.cellCssClass) {
                cellCssClass += " " + row.cellCssClass[column.field];
            }

            return "<td height='" + row.height + "' class='" + cellCssClass + "'>" + getCellContentHtml(column, row) + "</td>";
        }

        function buildLastCellHtml(column, opts) {
            return "<td class='" + settings.cssClass.cell + ' ' + settings.cssClass.cellLast + "'></td>";
        }

        /*
        Cell content
        */
        function getCellContentHtml(column, row) {
            var value = "";

            if (column.field in row.item && (row.editMode === false || column.editMode === false)) {
                value = getCellFormatter(column, row);
            }
            return value;
        }

        function getCellFormatter(column, row) {
            return (column.formatter) ? SmallGrid.Cell.Formatter[column.formatter](getCellValue(column, row), column, row, settings) : getCellValue(column, row);
        }

        function getCellValue(column, row) {
            return row.item[column.field];
        }


        $.extend(this, {
            "buildViewPortElements": buildViewPortElements,
            "buildHeaderColumnsHtml": buildHeaderColumnsHtml,
            "buildColsHtml": buildColsHtml,
            "buildRowsHtml": buildRowsHtml,
        });
    }

    function Create(settings) {
        return new Renderer(settings);
    }

})(jQuery);