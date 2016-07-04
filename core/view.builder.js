(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "View": {
            "Builder": {
                "Create": Create,
                "Builder": Builder
            }
        }
    });

    function Builder(settings) {
        var self = this;

        /*
        Structure
        */
        function buildViewPortElements($container) {
            var el = {
                'headerCol': null,
                'headerTbody': null,
                'headerTable': null,
                'headerWrap': null,
                'contentCol': null,
                'contentTbody': null,
                'contentTable': null,
                'contentWrap': null,
                'header': null,
                'content': null,
                'footer': null,
                'preload': null,
                'viewport': null,
                'container': $container
            };

            //create
            el['viewport'] = $("<div class='grid-viewport'/>");
            el['header'] = $("<div class='grid-header'/>");
            el['content'] = $("<div class='grid-content'/>");
            el['footer'] = $("<div class='grid-footer'/>");
            el['preload'] = $("<div class='grid-preload-font'/>");

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
            el['preload'].appendTo(el['viewport']);

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
                html += buildHeaderColumnHtml(columns[i], opts, length === i);
            }

            if (opts.virtualColumnWidth >= 0 && settings.showLastColumn === true) {
                html += buildLastHeaderColumn(columns[i - 1], opts);
            }

            return html + "</tr>";
        }

        function buildHeaderColumnCss(column, opts, isLastColumn) {
            var cellCssClass = settings.cssClass.headerCell;

            if (column.headerCssClass) {
                cellCssClass += " " + column.headerCssClass;
            }

            if (isLastColumn && opts.hideColumnBorder) {
                cellCssClass += " " + settings.cssClass.cellColumnLast;
            }

            switch (column.align) {
                case "center":
                    cellCssClass += " " + settings.cssClass.cellAlignCenter;
                    break;
                case "right":
                    cellCssClass += " " + settings.cssClass.cellAlignRight;
                    break;
            }


            if (column.sortable || column.filterable) {
                cellCssClass += " " + settings.cssClass.cursorPointer;
            }

            return cellCssClass;
        }

        function buildHeaderColumnHtml(column, opts, isLastColumn) {
            var html;

            html = "<td style='height:" + settings.header.height + "px' class='" + buildHeaderColumnCss(column, opts, isLastColumn) + "'><div class='" + settings.cssClass.headerCellDiv + "'><span class='" + settings.cssClass.headerColumnName + "'>" + (column.name || "") + "</span>";


            if (column.sortable && column.sortOrder !== 0) {
                html += "<span class='" + (column.sortOrder === 1 ? settings.cssClass.headerSortUp : settings.cssClass.headerSortDown) + "'></span>";
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
            return "<td class='" + settings.cssClass.headerCell + ' ' + settings.cssClass.cellColumnLast + "' style='height:" + settings.header.height + "px'></td>";
        }

        /*
        Cols
        */
        function buildColsHtml(columns, opts) {
            var html = '';
            for (var i = 0, length = columns.length; i < length; i++) {
                html += buildColHtml(columns[i]);
            }

            if (opts.virtualColumnWidth >= 0 && settings.showLastColumn === true) {
                html += buildLastColHtml(columns[i - 1], opts);
            }

            return html;
        }

        function buildColCss(column) {
            var cellCssClass = settings.cssClass.col;
            if (column.headerCssClass) {
                cellCssClass += " " + column.headerCssClass;
            }

            return cellCssClass;
        }

        function buildColHtml(column) {
            return "<col style='width:" + (column.width + settings.cellOuterSize.width) + "px;' class='" + buildColCss(column) + "'/>";
        }

        function buildLastColHtml(column, opts) {
            return "<col style='width:" + opts.virtualColumnWidth + "px;' class='" + settings.cssClass.col + " " + settings.cssClass.collLast + "'/>";
        }

        /*
        Rows
        */
        function buildRowsHtml(columns, rows, opts) {
            var html = '';
            for (var i = 0, length = rows.length - 1; i <= length; i++) {
                html += buildRowHtml(columns, rows[i], opts, length === i);
            }
            return html;
        }

        function buildRowCss(columns, row, opts, isLastRow) {
            var rowCssClass = settings.cssClass.row + (row.calcIndex & 1 === 1 ? " " + settings.cssClass.rowEven : " " + settings.cssClass.rowOdd);

            if (row.rowCssClass) rowCssClass += " " + row.rowCssClass;

            switch (row.valign || settings.rows.valign) {
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

            return rowCssClass;
        }

        function buildRowHtml(columns, row, opts, isLastRow) {
            var html = "<tr class='" + buildRowCss(columns, row, opts, isLastRow) + "'>";
            for (var i = 0, length = columns.length - 1; i <= length; i++) {
                html += buildCellHtml(columns[i], row, opts, length === i, isLastRow);
            }

            if (opts.virtualColumnWidth >= 0 && settings.showLastColumn === true) {
                html += buildLastCellHtml(columns[i - 1], opts, isLastRow);
            }

            return html + '</tr>';
        }

        function buildCellCss(column, row, opts, isLastColumn, isLastRow) {
            var cellCssClass = settings.cssClass.cell;
            if (column.cellCssClass) {
                cellCssClass += " " + column.cellCssClass;
            }

            if (isLastColumn && opts.hideColumnBorder) {
                cellCssClass += " " + settings.cssClass.cellColumnLast;
            }

            if (isLastRow && opts.hideRowBorder) {
                cellCssClass += " " + settings.cssClass.cellRowLast;
            }

            if (column.align === "center") {
                cellCssClass += " " + settings.cssClass.cellAlignCenter;
            }

            if (column.align === "right") {
                cellCssClass += " " + settings.cssClass.cellAlignRight;
            }

            if (row.cellCssClass && column.field in row.cellCssClass) {
                cellCssClass += " " + row.cellCssClass[column.field];
            }

            if (row.editMode === true && column.editMode === true) {
                cellCssClass += " " + settings.cssClass.cellEdit;
            }

            return cellCssClass;
        }

        function buildCellHtml(column, row, opts, isLastColumn, isLastRow) {
            return "<td height='" + row.height + "' class='" + buildCellCss(column, row, opts, isLastColumn, isLastRow) + "'>" + buildCellContentHtml(column, row) + "</td>";
        }

        function buildLastCellHtml(column, opts, isLastRow) {
            var cssClass = settings.cssClass.cell + ' ' + settings.cssClass.cellColumnLast;
            if (isLastRow && opts.hideRowBorder) cssClass += ' ' + settings.cssClass.cellRowLast;
            return "<td class='" + cssClass + "'></td>";
        }

        /*
        Cell content
        */
        function buildCellContentHtml(column, row) {
            var value = "";

            if (column.field in row.item && (row.editMode === false || column.editMode === false)) {
                value = getCellFormatter(column, row);
            }
            return value;
        }

        function getCellFormatter(column, row) {
            return column.formatter ? SmallGrid.Cell.Formatter[column.formatter](getCellValue(column, row), column, row, settings) : getCellValue(column, row);
        }

        function getCellValue(column, row) {
            return row.item[column.field];
        }


        $.extend(this, {
            "buildCellContentHtml": buildCellContentHtml,
            "buildColsHtml": buildColsHtml,
            "buildHeaderColumnsHtml": buildHeaderColumnsHtml,
            "buildRowsHtml": buildRowsHtml,
            "buildViewPortElements": buildViewPortElements
        });
    }

    function Create(settings) {
        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        return new Builder(settings);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});