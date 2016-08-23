(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "CellAlign": CellAlignPlugin
        }
    });

    function headerColumnCssFormatter(column, opts, isLastColumn) {

    }

    function CellAlignPlugin(context, settings) {
        var self = this;

        var editOptions = {
            enabled: false
        };

        function init() {
            //register plugin settings
            if (!settings.plugins.CellAlign) {
                settings.plugins.CellAlign = {
                    enabled: false
                };
            }

            context.view.getBuilder().onHeaderColumnCss.subscribe(buildHeaderColumnCss);
            context.view.getBuilder().onCellCss.subscribe(buildCellCss);
            context.view.getBuilder().onRowCss.subscribe(buildRowCss);
            return self;
        }

        function destroy() {
            context.view.getBuilder().onHeaderColumnCss.unsubscribe(buildHeaderColumnCss);
            context.view.getBuilder().onCellCss.unsubscribe(buildCellCss);
            context.view.getBuilder().onRowCss.unsubscribe(buildRowCss);
        }

        /*
         * Handlers
         */
        function buildCellCss(cellCssClass, args) {
            switch (args.column.align) {
                case "center":
                    cellCssClass.push(settings.cssClass.cellAlignCenter);
                    break;
                case "right":
                    cellCssClass.push(settings.cssClass.cellAlignRight);
                    break;
            }
            return cellCssClass;
        }

        function buildHeaderColumnCss(cellCssClass, args) {
            switch (args.column.align) {
                case "center":
                    cellCssClass.push(settings.cssClass.cellAlignCenter);
                    break;
                case "right":
                    cellCssClass.push(settings.cssClass.cellAlignRight);
                    break;
            }
            return cellCssClass;
        }

        function buildRowCss(rowCssClass, args) {

            switch (args.row.valign || settings.rows.valign) {
                case "middle":
                    rowCssClass.push(settings.cssClass.rowValignMiddle);
                    break;
                case "top":
                    rowCssClass.push(settings.cssClass.rowValignTop);
                    break;
                case "bottom":
                    rowCssClass.push(settings.cssClass.rowValignBottom);
                    break;
                case "baseline":
                    rowCssClass.push(settings.cssClass.rowValignBaseline);
                    break;
            }
            return rowCssClass;
        }

        function alignRow(row, align) {
            if (row) {
                var request = context.view.suspendRender();
                context.rowsModel.setRowPropertyById(column.id, 'valign', align);
                context.view.resumeRender(request);
            }
        }

        function alignColumn(column, align) {
            if (column) {
                var request = context.view.suspendRender();
                context.columnsModel.setColumnPropertyById(column.id, 'align', align);
                context.view.resumeRender(request);
            }
        }

        /*
         * Public api
         */
        function alignColumnByIndex(idx, align) {
            alignColumn(context.columnsModel.getColumnByIndex(idx));

        }
        function alignColumnById(id, align) {
            alignColumn(context.columnsModel.getColumnById(id));
        }

        function alignRowByIdx(idx, align) {
            alignRow(context.rowsModel.getRowByIndex(idx));
        }

        function alignRowById(id, align) {
            alignRow(context.rowsModel.getRowById(id), align);
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "alignRowByIdx": alignRowByIdx,
            "alignRowById": alignRowById,
            "alignColumnByIndex": alignColumnByIndex,
            "alignColumnById": alignColumnById
        });
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});