"use strict";

(function ($) {
    $.extend(true, window, {
        "SmallGrid": {
            "View": {
                "Create": CreateView,
            }
        }
    });

    function ViewData($container, settings) {
        var self = this;
        var viewModel;

        var requestDataTimer = null;
        var requestRenderTimer = null;

        var heightRatio = 1;

        var suspend = true;
        var suspendRenderRequests = 0;

        var canvasSize = {
            width: 0,
            height: 0,
        };

        var cellOuterSize = {
            width: 0,
            height: 0,
        };

        //handlers
        var handlers = [];

        //elements
        var $viewport,
            $header,
            $canvas,
            $footer,
            $tableWrap,
            $table,
            $tableCol,
            $tableTbody,
            $headerWrap,
            $headerTable,
            $headerTbody;

        function init() {
            $container.empty().addClass(settings.uid);

            $viewport = $('<div class="small-grid grid-viewport"/>');
            $header = $('<div class="grid-header disable-text-selection"/>');
            $canvas = $('<div class="grid-canvas"/>');
            $footer = $('<div class="grid-footer"/>');

            $headerWrap = $('<div class="grid-header-wrap"/>');
            $headerTable = $('<table class="grid-header-table" border=1></table>');
            $headerTbody = $('<tbody></tbody>');

            $tableWrap = $('<div class="grid-table-wrap"/>');
            $table = $('<table class="grid-table" border=1></table>');
            $tableCol = $('<colgroup></colgroup>');
            $tableTbody = $('<tbody></tbody>');

            //main structure
            $header.appendTo($viewport);
            $canvas.appendTo($viewport);
            $footer.appendTo($viewport);

            //header part
            $headerTbody.appendTo($headerTable);
            $headerTable.appendTo($headerWrap);
            $headerWrap.appendTo($header);

            //table part
            $tableCol.appendTo($table);
            $tableTbody.appendTo($table);
            $table.appendTo($tableWrap);
            $tableWrap.appendTo($canvas);

            //bind scroll events
            if (settings.HandlerScroll) {
                handlers['scroll'] = new settings.HandlerScroll($canvas, {
                    "handleScrollStart": handleScrollStart,
                    "handleScrollStop": handleScrollStop,
                    "handleScroll": handleScroll,
                    "handleMouseWheelStart": handleMouseWheelStart,
                    "handleMouseWheelStop": handleMouseWheelStop,
                    "handleMouseWheel": handleMouseWheel,
                });
            }
            //bind resize events
            if (settings.HandlerResize) {
                handlers['resize'] = new settings.HandlerResize($header, {
                    "handleResize": handleHeaderResize,
                    "handleResizeStart": handleHeaderResizeStart,
                    "handleResizeStop": handleHeaderResizeStop,
                    "handlerIdentifier": "." + settings.cssClass.headerResizeHandle,
                });
            }
            //bind header click events
            if (settings.HandlerClick) {
                handlers['header'] = new settings.HandlerClick($header, {
                    "handleClick": handleHeaderClick,
                    "handleDblClick": handleHeaderDblClick,
                    "handleContextMenu": handleHeaderContextMenu,
                });
            }
            //bind cell click events
            if (settings.HandlerClick) {
                handlers['canvas'] = new settings.HandlerClick($canvas, {
                    "handleClick": handleCellClick,
                    "handleDblClick": handleCellDblClick,
                    "handleContextMenu": handleCellContextMenu,
                    "handleKeyDown": handleCellKeyDown,
                });
            }

            $(document.body).on("click", handleBodyClick);


            $viewport.appendTo($container);

            //calculate sizes
            cellOuterSize = settings.Utils.measureCellDiff($tableTbody);

            canvasSize = {
                width: $container.width(),
                height: $container.height(),
            };

            //setup sizes
            $canvas.width(canvasSize.width);
            $canvas.height(canvasSize.height);

            //block invisible part in header
            $header.width(canvasSize.width - settings.scrollbarDimensions.width);

            self.onInitialize.notify({});
        }

        /*
        Nodes
        */
        function getContainerNode() {
            return $container;
        }

        function getViewPortNode() {
            return $viewport;
        }

        /*
        Visiblity func
        */
        function isCellVisible(columnId, rowId) {
            return isColumnVisible(columnId) && isRowVisible(rowId);
        }

        function isColumnVisible(columnId) {
            var column = viewModel.getColumnById(columnId);
            if (column) {
                if (column.calcWidth - column.width - cellOuterSize.width >= $canvas[0].scrollLeft && column.calcWidth < canvasSize.width + $canvas[0].scrollLeft) {
                    return true;
                }
            }
            return false;
        }

        function isRowVisible(rowId) {
            var row = viewModel.getRowById(rowId);
            if (row) {
                if (row.calcHeight - row.height - cellOuterSize.height >= $canvas[0].scrollTop && row.calcHeight + row.height + cellOuterSize.height < canvasSize.height + $canvas[0].scrollTop) {
                    return true;
                }
            }
            return false;
        }

        /*
        Row func
        */
        function getRowNodeByIndex(rowIndex) {
            return $tableTbody[0].rows[rowIndex];
        }

        function getCellNodeByIndex(cellIndex, rowIndex) {
            return $tableTbody[0].rows[rowIndex].cells[cellIndex];
        }

        function getRowNodeById(rowId) {
            if (viewModel) {
                var rowIndex = viewModel.getRowIndexById(rowId);
                if (rowIndex != -1) {
                    return getRowNodeByIndex(rowIndex);
                }
            }
        }

        function getCellNodeById(columnId, rowId) {
            var rowIndex = viewModel.getRowIndexById(rowId);
            var columnIndex = viewModel.getColumnIndexById(columnId);
            if (rowIndex != -1 && columnIndex != -1) {
                return getCellNodeByIndex(columnIndex, rowIndex);
            }
        }

        function setColumnWidthByIndex(columnIndex, width) {
            var $headerCell = $headerTable.find("tr > td:nth-child(" + (columnIndex) + ")");
            if ($headerCell) {
                $headerCell.css("width", width);
            }

            var $col = $table.find("colgroup > col:nth-child(" + (columnIndex) + ")");
            if ($col) {
                $col.css("width", width + cellOuterSize.width);
            }
        }

        function enableHeaderClass(cssClass) {
            $headerTbody.find("." + cssClass + '_disabled').toggleClass(cssClass + '_disabled ' + cssClass);
        }

        function disableHeaderClass(cssClass) {
            $headerTbody.find("." + cssClass).toggleClass(cssClass + ' ' + cssClass + '_disabled');
        }

        function addViewPortClass(cssClass) {
            $viewport.addClass(cssClass);
        }

        function removeViewPortClass(cssClass) {
            $viewport.removeClass(cssClass);
        }


        /*
        Public api
        */
        function setModel(model) {
            suspendRender(true);

            viewModel = model;
            viewModel.onRowsChange.subscribe(handleRowsChange);
            viewModel.onColumnsChange.subscribe(handleColumnsChange);

            viewModel.onDataChange.subscribe(handleDataChange);
            viewModel.onDataChangeStart.subscribe(handleDataChangeStart);
            viewModel.onDataChangeStop.subscribe(handleDataChangeStop);

            suspendRender(false);
        }

        function render() {
            suspendRenderRequests++;

            if (suspend === false) {
                renderRequests();
            }

            return this;
        }

        function renderRequests() {
            if (suspend === false && suspendRenderRequests > 0) {

                if (requestDataTimer == null) {
                    suspendRenderRequests = 0;

                    requestDataTimer = setTimeout(function () {
                        viewModel.requestDataFromRange(
                            {
                                top: $canvas[0].scrollTop * heightRatio,
                                left: $canvas[0].scrollLeft
                            },
                            canvasSize,
                            cellOuterSize,
                            heightRatio == 1
                        );
                        requestDataTimer = null;
                        requestRenderTimer = null;
                    }, 30);

                } else if (requestRenderTimer == null) {
                    requestRenderTimer = setTimeout(render, 300);
                }
            }
            return this;
        }

        function isRenderSuspended() {
            return suspend;
        }

        function suspendRender(value) {
            suspend = value;
            return this;
        }

        function destroy() {
            suspendRender(true);

            if (viewModel) {
                viewModel.onRowsChange.unsubscribe(handleRowsChange);
                viewModel.onColumnsChange.unsubscribe(handleColumnsChange);
                viewModel.onDataChange.unsubscribe(handleDataChange);
                viewModel.onDataChangeStart.unsubscribe(handleDataChangeStart);
                viewModel.onDataChangeStop.unsubscribe(handleDataChangeStop);
            }

            if ($container.length) {
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].destroy();
                }
                $container.empty().removeClass(settings.uid);
            }
            $(document.body).off("click", handleBodyClick);
            self.onDestroy.notify({});
        }

        /*
        Render part
        */
        function renderView(columnsHtml, colsHtml, rowsHtml) {
            self.onBeforeRowsRendered.notify({});

            $headerTbody[0].innerHTML = columnsHtml;
            $tableCol[0].innerHTML = colsHtml;
            $tableTbody[0].innerHTML = rowsHtml;

            self.onAfterRowsRendered.notify({});
        }

        /*
        Build part
        */
        function buldHeaderColumnsHtml(columns) {
            var html = '<tr class="' + settings.cssClass.headerRow + '">';
            for (var i = 0; i < columns.length; i++) {
                html += buildHeaderColumnHtml(columns[i]);
            }
            return html + buildLastHeaderColumn() + '</tr>';
        }

        function buildLastHeaderColumn() {
            return "<td class='" + settings.cssClass.headerCell + "' style='height:" + settings.columns.header.height + "px'></td>";
        }

        function buildHeaderColumnHtml(column) {
            var value = "",
                html,
                cellCssClass = settings.cssClass.headerCell;

            if (column.headerCssClass) {
                cellCssClass += " " + column.headerCssClass;
            }

            if (column.name) {
                value += column.name;
            }

            if (column.sortable || column.filterable) {
                cellCssClass += " " + settings.cssClass.cursorPointer;
            }

            html = "<td style='width:" + (column.width) + "px;height:" + settings.columns.header.height + "px' class='" + cellCssClass + "'><div class='" + settings.cssClass.headerRowDiv + "'><span class='" + settings.cssClass.headerColumnName + "'>" + value + "</span>";


            if (column.sortable && column.sortOrder !== 0) {
                html += "<span class='" + ((column.sortOrder == 1) ? settings.cssClass.headerSortUp : settings.cssClass.headerSortDown) + "'></span>";
            }

            if (column.filterable) {
                html += "<span class='" + settings.cssClass.headerFilter + "'></span>";
            }

            if (column.resizeable) {
                html += "<span class='" + settings.cssClass.headerResizeHandle + "'></span>";
            }

            return html + "</div></td>";
        }

        function buildColsHtml(columns) {
            var html = '';
            for (var i = 0; i < columns.length; i++) {
                html += buildColHtml(columns[i]);
            }
            return html + buildLastColHtml();
        }

        function buildLastColHtml() {
            return "<col class='" + settings.cssClass.col + "' style='width:0px;' />";
        }

        function buildColHtml(column) {
            var cellCssClass = settings.cssClass.col;
            if (column.headerCssClass) {
                cellCssClass += " " + column.headerCssClass;
            }

            return "<col style='width:" + (column.width + cellOuterSize.width) + "px;' class='" + cellCssClass + "'/>";
        }

        function buildRowsHtml(columns, rows) {
            var html = '';
            for (var i = 0; i < rows.length; i++) {
                html += buildRowHtml(columns, rows[i], i);
            }
            return html;
        }

        function buildRowHtml(columns, row, index) {
            var rowCssClass = settings.cssClass.row + ((row.calcIndex & 1 == 1) ? " " + settings.cssClass.rowEven : " " + settings.cssClass.rowOdd);
            if (row.rowCssClass) {
                rowCssClass += " " + row.rowCssClass;
            }
            //todo: remove
            if (settings.rows.formatter) {
                row = settings.rows.formatter(row, columns);
            }

            var html = "<tr class='" + rowCssClass + "'>";
            for (var i = 0; i < columns.length; i++) {
                html += buildCellHtml(columns[i], row);
            }
            return html + buildLastCellHtml() + '</tr>';
        }

        function buildLastCellHtml() {
            return "<td class='" + settings.cssClass.cell + "'></td>";
        }

        function buildCellHtml(column, row) {
            var cellCssClass = settings.cssClass.cell;
            if (column.cellCssClass) {
                cellCssClass += " " + column.cellCssClass;
            }

            if (row.cellCssClass && column.field in row.cellCssClass) {
                cellCssClass += " " + row.cellCssClass[column.field];
            }

            return "<td height='" + row.height + "' class='" + cellCssClass + "'>" + buildCellContentHtml(column, row) + "</td>";
        }

        function buildCellContentHtml(column, row) {
            var value = "";

            if (column.field in row.item && (row.editMode === false || column.editMode === false)) {
                value = (column.formatter) ? settings.RowFormatter[column.formatter](row.item[column.field], column, row, settings) : row.item[column.field];
            }
            return value;
        }

        /*
        Calc private funcs
        */
        function getColumnEventType(targetClass, column) {
            var type = "";
            if (column.resizeable && targetClass.indexOf(settings.cssClass.headerResizeHandle) != -1) {
                type = "resize";
            } else if (column.filterable && targetClass.indexOf(settings.cssClass.headerFilter) != -1) {
                type = "filter";
            } else if (column.sortable) {
                type = "sort";
            }
            return type;
        }

        //todo: fix multiple types, edit && select, remove, add type registration
        function getCellEventType(targetClass, column, row) {
            var type = "";
            if (row.editable === true && column.editable === true) {
                type = "edit";
            } else if (row.disabled === true) {
                type = "disabled";
            }
            return type;
        }

        function getColumnEvent(e) {
            var column = viewModel.getColumnByIndex(e.cellIndex);
            if (column) {
                e.type = getColumnEventType($(e.event.target).attr("class"), column);
                e.targetClass = $(e.event.target).attr("class");
                e.column = column;
                return e;
            }
        }

        function getCellEvent(e) {
            var column = viewModel.getColumnByIndex(e.cellIndex);
            var row = viewModel.getRowByIndex(e.rowIndex);

            if (column && column.field.length > 0 && row && column.field in row.item) {
                //replace with extend
                e.type = getCellEventType($(e.event.target).attr("class"), column, row);
                e.row = row;
                e.column = column;

                return e;
            }
        }

        /*
        Data handlers
        */


        function handleRowsChange(e) {
            if (viewModel) {
                var itemsHeight = viewModel.getRowsHeight(cellOuterSize);

                if (itemsHeight > settings['maxSupportedCssHeight']) {
                    heightRatio = (itemsHeight - canvasSize.height + settings['scrollbarDimensions'].height) / (settings['maxSupportedCssHeight'] - canvasSize.height + settings['scrollbarDimensions'].height);
                    itemsHeight = settings['maxSupportedCssHeight'];
                }

                $tableWrap.css({
                    'height': itemsHeight,
                });
            }
        }

        function handleColumnsChange(e) {
            if (viewModel) {
                var columnsWidth = viewModel.getColumnsWidth(cellOuterSize);

                $headerWrap.css({
                    'width': columnsWidth
                });

                $tableWrap.css({
                    'width': columnsWidth,
                });
            }
        }

        function handleDataChange(e) {
            render();
        }

        function handleDataChangeStart(e) {
            suspendRender(true);
        }

        function handleDataChangeStop(e) {
            if (e.rows.length > 0 && e.columns.length > 0) {
                $headerTable.css({
                    'left': e.columns[0].calcWidth - e.columns[0].width - cellOuterSize.width
                });

                $table.css({
                    'top': e.rows[0].calcHeight - e.rows[0].height - cellOuterSize.width - ($canvas[0].scrollTop * heightRatio) + $canvas[0].scrollTop,
                    'left': e.columns[0].calcWidth - e.columns[0].width - cellOuterSize.width
                });

                renderView(
                    buldHeaderColumnsHtml(e.columns),
                    buildColsHtml(e.columns),
                    buildRowsHtml(e.columns, e.rows)
                );
            }

            suspendRender(false);
        }

        /*
        Handle cell events
        */
        function handleCellClick(e) {
            var cellEvent = getCellEvent(e);
            if (cellEvent) {
                suspendRender(true);
                self.onCellClick.notify(cellEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        function handleCellDblClick(e) {
            var cellEvent = getCellEvent(e);
            if (cellEvent) {
                suspendRender(true);
                self.onCellDblClick.notify(cellEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        function handleCellContextMenu(e) {
            var cellEvent = getCellEvent(e);
            if (cellEvent) {
                suspendRender(true);
                self.onCellContextMenu.notify(cellEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        function handleCellKeyDown(e) {
            var cellEvent = getCellEvent(e);
            if (cellEvent) {
                suspendRender(true);
                self.onCellKeyDown.notify(cellEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        /*
        Handle resize events
        */
        function handleHeaderResize(e) {
            suspendRender(true);
            self.onColumnResize.notify(e);
            suspendRender(false);
            renderRequests();
        }

        function handleHeaderResizeStart(e) {
            suspendRender(true);
            self.onColumnResizeStart.notify(e);
            suspendRender(false);
            renderRequests();
        }

        function handleHeaderResizeStop(e) {
            suspendRender(true);
            self.onColumnResizeStop.notify(e);
            suspendRender(false);
            renderRequests();
        }

        /*
        Handle mouse wheel
        */
        function handleMouseWheelStart(e) {
            suspendRender(true);
            self.onMouseWheelStart.notify(e);
            suspendRender(false);
            renderRequests();
        }

        function handleMouseWheelStop(e) {
            suspendRender(true);
            self.onMouseWheelStop.notify(e);
            suspendRender(false);
            renderRequests();
        }

        function handleMouseWheel(e) {
            suspendRender(true);
            self.onMouseWheel.notify(e);
            suspendRender(false);
            render();
        }

        /*
        Handle scroll
        */
        function handleScrollStart(e) {
            suspendRender(true);
            self.onScrollStart.notify(e);
            suspendRender(false);
            renderRequests();
        }

        function handleScrollStop(e) {
            suspendRender(true);
            self.onScrollStop.notify(e);
            suspendRender(false);
            renderRequests();
        }

        function handleScroll(e) {
            self.suspendRender(true);
            $header[0].scrollLeft = $canvas[0].scrollLeft;
            self.onScroll.notify(e);
            self.suspendRender(false);
            render();
        }

        /*
        Handle body events
        */
        function handleBodyClick(e) {
            suspendRender(true);
            self.onBodyClick.notify({
                event: e,
            });
            suspendRender(false);
            renderRequests();
        }

        /*
        Handle header events
        */
        function handleHeaderClick(e) {
            var columnEvent = getColumnEvent(e);
            if (columnEvent) {
                suspendRender(true);
                self.onHeaderClick.notify(columnEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        function handleHeaderContextMenu(e) {
            var columnEvent = getColumnEvent(e);
            if (columnEvent) {
                suspendRender(true);
                self.onHeaderContextMenu.notify(columnEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        function handleHeaderDblClick(e) {
            var columnEvent = getColumnEvent(e);
            if (columnEvent) {
                suspendRender(true);
                self.onHeaderDblClick.notify(columnEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        $.extend(this, {
            "destroy": destroy,

            //Events
            "onScroll": new SmallGrid.Event.Handler(),
            "onScrollStart": new SmallGrid.Event.Handler(),
            "onScrollStop": new SmallGrid.Event.Handler(),

            "onMouseWheel": new SmallGrid.Event.Handler(),
            "onMouseWheelStart": new SmallGrid.Event.Handler(),
            "onMouseWheelStop": new SmallGrid.Event.Handler(),

            "onBodyClick": new SmallGrid.Event.Handler(),

            "onHeaderClick": new SmallGrid.Event.Handler(),
            "onHeaderContextMenu": new SmallGrid.Event.Handler(),
            "onHeaderDblClick": new SmallGrid.Event.Handler(),

            "onHeaderFilter": new SmallGrid.Event.Handler(),
            "onHeaderResize": new SmallGrid.Event.Handler(),
            "onHeaderSort": new SmallGrid.Event.Handler(),

            "onCellClick": new SmallGrid.Event.Handler(),
            "onCellContextMenu": new SmallGrid.Event.Handler(),
            "onCellDblClick": new SmallGrid.Event.Handler(),
            "onCellKeyDown": new SmallGrid.Event.Handler(),

            "onColumnResize": new SmallGrid.Event.Handler(),
            "onColumnResizeStart": new SmallGrid.Event.Handler(),
            "onColumnResizeStop": new SmallGrid.Event.Handler(),

            "onAfterRowsRendered": new SmallGrid.Event.Handler(),
            "onBeforeRowsRendered": new SmallGrid.Event.Handler(),

            "onInitialize": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),

            "getContainerNode": getContainerNode,
            "getViewPortNode": getViewPortNode,

            "getRowNodeById": getRowNodeById,
            "getRowNodeByIndex": getRowNodeByIndex,
            "getCellNodeByIndex": getCellNodeByIndex,
            "getCellNodeById": getCellNodeById,
            "isCellVisible": isCellVisible,

            "addViewPortClass": addViewPortClass,
            "disableHeaderClass": disableHeaderClass,
            "enableHeaderClass": enableHeaderClass,
            "removeViewPortClass": removeViewPortClass,
            "setColumnWidthByIndex": setColumnWidthByIndex,


            "isRenderSuspended": isRenderSuspended,
            "render": render,
            "setModel": setModel,
            "suspendRender": suspendRender,
        });

        init();
    }


    function CreateView(container, data, columns, settings) {
        var $container = $(container);
        if ($container.length < 1) {
            throw new Error("Small grid requires a valid container, " + container + " does not exist in the DOM.");
        }

        return new ViewData($container, data, columns, settings);
    }

})(jQuery);