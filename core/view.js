(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "View": {
                "Create": CreateView,
                "View": ViewData,
            }
        }
    });


    function ViewData($container, viewModel, renderer, settings) {
        var self = this,
            contentSize =
            {
                width: 0,
                height: 0,
            },
            el = {},
            handlers = [],
            heightRatio = 1,
            requestDataTimer = null,
            requestRenderTimer = null,
            scrollVisibility =
            {
                horisontal: false,
                vertical: false,
            },
            suspendRequests = [],
            suspendScrollEvent = false,
            suspendRenderRequests = 0;

        /*Init and destroy*/
        function init() {
            var request = suspendRender();

            el = renderer.buildViewPortElements($container);
            el.container.empty().addClass(settings.uid);

            //viewport
            el.viewport.appendTo(el.container);


            //bind events           
            handlers.push(
                SmallGrid.Handler.Resize.Create(el.header, {
                    "handleResize": handleHeaderResize,
                    "handleResizeStart": handleHeaderResizeStart,
                    "handleResizeStop": handleHeaderResizeStop,
                    "handlerIdentifier": "." + settings.cssClass.headerResizeHandle,
                }),
                SmallGrid.Handler.Click.Create(el.header, {
                    "handleClick": handleHeaderClick,
                    "handleDblClick": handleHeaderDblClick,
                    "handleContextMenu": handleHeaderContextMenu,
                }),
                SmallGrid.Handler.Click.Create(el.content, {
                    "handleClick": handleCellClick,
                    "handleDblClick": handleCellDblClick,
                    "handleContextMenu": handleCellContextMenu,
                    "handleKeyDown": handleCellKeyDown,
                }),
                SmallGrid.Handler.Scroll.Create(el.content, {
                    "handleScrollStart": handleScrollStart,
                    "handleScrollStop": handleScrollStop,
                    "handleScroll": handleScroll,
                    "handleMouseWheelStart": handleMouseWheelStart,
                    "handleMouseWheelStop": handleMouseWheelStop,
                    "handleMouseWheel": handleMouseWheel,
                })
            );

            $(document).on("click", handleBodyClick);

            viewModel.onRowsChange.subscribe(handleRowsChange);
            viewModel.onColumnsChange.subscribe(handleColumnsChange);


            //block invisible part in header ????
            //el.header.width(contentSize.width - settings.scrollbarDimensions.width);

            resize();

            handleRowsChange();
            if (settings.resizeColumnsOnLoad === true) resizeColumns();
            handleColumnsChange();

            renderView();

            resumeRender(request);

            self.onInitialize.notify({});

            return self;
        }

        function destroy() {
            suspendRender();

            renderer = null;

            viewModel.onRowsChange.unsubscribe(handleRowsChange);
            viewModel.onColumnsChange.unsubscribe(handleColumnsChange);

            if (el.container.length) {
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].destroy();
                }
                el.container.empty().removeClass(settings.uid);
            }
            $(document.body).off("click", handleBodyClick);
            self.onDestroy.notify({});
        }

        /* 
        Scroll
        */
        function isHorisontalScrollVisible() {
            return scrollVisibility.horisontal;
        }

        function isVerticalScrollVisible() {
            return scrollVisibility.vertical;
        }

        /*
        Nodes
        */
        function getNode(name) {
            if (el[name]) return el[name];
        }

        /*
        Row func
        */
        function isRowVisible(rowId) {
            var row = viewModel.getRowById(rowId);
            if (row) {
                return (row.calcHeight - row.height - settings.cellOuterSize.height >= el.content[0].scrollTop && row.calcHeight + row.height + settings.cellOuterSize.height < contentSize.height + el.content[0].scrollTop);

            }
            return false;
        }

        function getRowNodeByIndex(rowIndex) {
            return el.contentTbody[0].rows[rowIndex];
        }

        function getRowNodeById(rowId) {
            var rowIndex = viewModel.getRowIndexById(rowId);
            if (rowIndex != -1) {
                return getRowNodeByIndex(rowIndex);
            }
        }

        /*
        Cell func
        */
        function isCellVisible(columnId, rowId) {
            return isColumnVisible(columnId) && isRowVisible(rowId);
        }

        function getCellNodeByIndex(columnIndex, rowIndex) {
            return el.contentTbody[0].rows[rowIndex].cells[columnIndex];
        }

        function getCellNodeById(columnId, rowId) {
            var rowIndex = viewModel.getRowIndexById(rowId);
            var columnIndex = viewModel.getColumnIndexById(columnId);
            if (rowIndex != -1 && columnIndex != -1) {
                return getCellNodeByIndex(columnIndex, rowIndex);
            }
        }

        /*
        Column func
        */
        function isColumnVisible(columnId) {
            var column = viewModel.getColumnById(columnId);
            if (column) {
                return (column.calcWidth - column.width - settings.cellOuterSize.width >= el.content[0].scrollLeft && column.calcWidth < contentSize.width + el.content[0].scrollLeft);
            }
            return false;
        }

        /*
        Model
        */
        function getModel() {
            return viewModel;
        }

        /*
        Render
        */

        function render() {
            suspendRenderRequests++;
            renderRequests();
            return self;
        }

        function renderRequests() {
            if (isSuspended() === false && suspendRenderRequests > 0) {

                if (requestDataTimer == null) {
                    requestDataTimer = setTimeout(function () {
                        renderView();
                        requestDataTimer = requestRenderTimer = null;
                    }, 30);

                } else if (requestRenderTimer == null) {
                    requestRenderTimer = setTimeout(render, 200);
                }
            }
            return self;
        }

        function renderView() {

            var request = suspendRender();
            suspendRenderRequests = 0;
            var result = viewModel.requestDataFromRange(
                {
                    top: el.content[0].scrollTop * heightRatio,
                    left: el.content[0].scrollLeft
                },
                contentSize,
                settings.cellOuterSize,
                heightRatio == 1
            );

            if (result.columns.length > 0 && result.isCached === 0) {

                el.headerTable.css({
                    'left': result.columns[0].calcWidth - result.columns[0].width - settings.cellOuterSize.width
                });

                if (result.rows.length > 0) {
                    el.contentTable.css({
                        'top': result.rows[0].calcHeight - result.rows[0].height - settings.cellOuterSize.height - (el.content[0].scrollTop * heightRatio) + el.content[0].scrollTop,
                        'left': result.columns[0].calcWidth - result.columns[0].width - settings.cellOuterSize.width
                    });
                }

                var opts =
                    {
                        hideColumnBorder: false,
                        virtualColumnWidth: 0,
                    },
                    lastColumn = result.columns[result.columns.length - 1];

                if (scrollVisibility.vertical === false && contentSize.width <= lastColumn.calcWidth) {
                    opts.hideColumnBorder = true;
                }


                if (settings.showLastColumn === true && contentSize.width >= lastColumn.calcWidth) {
                    opts.virtualColumnWidth = contentSize.width - lastColumn.calcWidth;
                }

                renderViewHtml(
                    renderer.buildHeaderColumnsHtml(result.columns, opts),
                    renderer.buildColsHtml(result.columns, opts),
                    renderer.buildRowsHtml(result.columns, result.rows, opts)
                );
            }

            resumeRender(request);
        }

        function renderViewHtml(columnsHtml, colsHtml, rowsHtml) {

            self.onBeforeRowsRendered.notify({});

            el.headerCol[0].innerHTML = el.contentCol[0].innerHTML = colsHtml;
            el.headerTbody[0].innerHTML = columnsHtml;
            el.contentTbody[0].innerHTML = rowsHtml;

            self.onAfterRowsRendered.notify({});
        }

        function isSuspended() {
            return suspendRequests.length > 0;
        }

        function suspendRender() {
            var id = SmallGrid.Utils.createGuid();
            suspendRequests.push(id);
            return id;
        }

        function resumeRender(value) {
            for (var i = 0; i < suspendRequests.length; i++) {
                if (suspendRequests[i] == value) {
                    suspendRequests.splice(i, 1);
                    break;
                }
            }
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

        function getColumnEvent(event) {
            var column = viewModel.getColumnByIndex(event.cellIndex);
            if (column) {
                event.type = getColumnEventType($(event.event.target).attr("class"), column);
                event.targetClass = $(event.event.target).attr("class");
                event.column = column;
                return event;
            }
        }

        function getCellEvent(event) {
            var column = viewModel.getColumnByIndex(event.cellIndex);
            var row = viewModel.getRowByIndex(event.rowIndex);

            if (column && column.field.length > 0 && row && column.field in row.item) {
                //replace with extend
                event.type = getCellEventType($(event.event.target).attr("class"), column, row);
                event.row = row;
                event.column = column;

                return event;
            }
        }

        /*
        Resize 
        */
        function resizeColumnsWidth(allColumns, scrollBarWidth, cellOuterWidth) {
            var updateColumns = allColumns.slice();
            var total =
                {
                    minWidth: 0,
                    maxWidth: 0,
                    width: 0
                },
                contentWidth = contentSize.width - updateColumns.length * cellOuterWidth - scrollBarWidth;

            for (var i = updateColumns.length - 1; i >= 0; i--) {
                var updateColumn = updateColumns[i];
                if (updateColumn.resizeable === false) {
                    contentWidth -= updateColumn.width;
                    updateColumns.splice(i, 1);
                    continue;
                }
                total.minWidth += updateColumn.minWidth;
                total.maxWidth += updateColumn.maxWidth;
                total.width += updateColumn.width;
            }

            if (total.minWidth <= contentWidth && contentWidth <= total.maxWidth) {
                var columns = updateColumns.slice();
                while (columns.length > 0) {
                    var ratio = contentWidth / total.width;
                    total.width = 0;

                    for (i = columns.length - 1; i >= 0; i--) {
                        var column = columns[i];
                        var newColumnWidth = Math.max(
                            Math.min(
                                Math.floor(column.width * ratio),
                                column.maxWidth
                            ),
                            column.minWidth
                        );

                        total.width += newColumnWidth;

                        if (column.width == newColumnWidth) {
                            if (columns.length == 1 && contentWidth != column.width) {
                                column.width += contentWidth - column.width;
                            }
                            contentWidth -= column.width;
                            columns.splice(i, 1);
                            continue;
                        }

                        column.width = newColumnWidth;
                    }
                }
            }
            return updateColumns;
        }

        function resizeColumns() {

            var updateColumns = resizeColumnsWidth(
                viewModel.columns.getColumns(),
                (scrollVisibility.vertical === true) ? settings.scrollbarDimensions.width : 0,
                settings.cellOuterSize.width
            );

            var request = suspendRender();

            for (var i = 0; i < updateColumns.length; i++) {
                viewModel.columns.setColumnPropertyById(
                    updateColumns[i].id,
                    'width',
                    updateColumns[i].width
                );
            }

            resumeRender(request);

            return self;
        }

        function resize() {
            contentSize.width = el.container.width();
            contentSize.height = el.container.height() - settings.header.height - settings.cellOuterSize.height;
            el.content.width(contentSize.width);
            el.content.height(contentSize.height);
            return self;
        }

        /*
        Data handlers
        */
        function handleRowsChange() {
            var rowsHeight = viewModel.getRowsHeight(settings.cellOuterSize);

            scrollVisibility.vertical = (rowsHeight > contentSize.height);

            if (rowsHeight > settings.maxSupportedCssHeight) {
                heightRatio = (rowsHeight - contentSize.height + settings.scrollbarDimensions.height) / (settings.maxSupportedCssHeight - contentSize.height + settings.scrollbarDimensions.height);
                rowsHeight = settings.maxSupportedCssHeight;
            }

            //fix?
            el.header.css({
                'width': scrollVisibility.vertical ? contentSize.width - settings.scrollbarDimensions.width : contentSize.width
            });

            el.contentWrap.css({
                'height': rowsHeight,
            });

            render();
        }

        function handleColumnsChange() {
            var columnsWidth = viewModel.getColumnsWidth(settings.cellOuterSize);

            scrollVisibility.horisontal = (columnsWidth > contentSize.width);

            var width = Math.max(
                columnsWidth,
                scrollVisibility.vertical ? contentSize.width - settings.scrollbarDimensions.width : contentSize.width
            );

            el.headerWrap.css({
                'width': width
            });

            el.contentWrap.css({
                'width': width,
            });

            render();
        }

        /*
        Handle cell events
        */
        function handleCellClick(event) {
            var cellEvent = getCellEvent(event);
            if (cellEvent) {
                //console.log(event);
                notifyEvent(cellEvent, "onCellClick");
            }
        }

        function handleCellDblClick(event) {
            var cellEvent = getCellEvent(event);
            if (cellEvent) {
                //console.log(event);
                notifyEvent(cellEvent, "onCellDblClick");
            }
        }

        function handleCellContextMenu(event) {
            var cellEvent = getCellEvent(event);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellContextMenu");
            }
        }

        function handleCellKeyDown(event) {
            var cellEvent = getCellEvent(event);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellKeyDown");
            }
        }

        /*
        Handle resize events
        */
        function handleHeaderResize(event) {
            notifyEvent(event, "onColumnResize");
        }

        function handleHeaderResizeStart(event) {
            suspendScrollEvent = true;
            notifyEvent(event, "onColumnResizeStart");
        }

        function handleHeaderResizeStop(event) {
            suspendScrollEvent = false;
            notifyEvent(event, "onColumnResizeStop");
        }

        /*
        Handle mouse wheel
        */
        function handleMouseWheelStart(event) {
            notifyEvent(event, "onMouseWheelStart");
        }

        function handleMouseWheelStop(event) {
            notifyEvent(event, "onMouseWheelStop");
        }

        function handleMouseWheel(event) {
            notifyEvent(event, "onMouseWheel");
        }

        /*
        Handle scroll
        */
        function handleScrollStart(event) {
            if (suspendScrollEvent === false) {
                notifyEvent(event, "onScrollStart");
            }
        }

        function handleScrollStop(event) {
            if (suspendScrollEvent === false) {
                notifyEvent(event, "onScrollStop");
            }
        }

        function handleScroll(event) {
            if (suspendScrollEvent === false) {
                el.header[0].scrollLeft = el.content[0].scrollLeft;
                render();
                notifyEvent(event, "onScroll");
            }
        }

        /*
        Handle body events
        */
        function handleBodyClick(event) {
            notifyEvent(event, "onBodyClick");
        }

        /*
        Handle header events
        */
        function handleHeaderClick(event) {
            var columnEvent = getColumnEvent(event);
            if (columnEvent) {
                notifyEvent(columnEvent, "onHeaderClick");
            }
        }

        function handleHeaderContextMenu(event) {
            var columnEvent = getColumnEvent(event);
            if (columnEvent) {
                notifyEvent(columnEvent, "onHeaderContextMenu");
            }
        }

        function handleHeaderDblClick(event) {
            var columnEvent = getColumnEvent(event);
            if (columnEvent) {
                notifyEvent(columnEvent, "onHeaderDblClick");
            }
        }

        function notifyEvent(event, handlerName) {
            self[handlerName].notify(event);
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "getCellNodeById": getCellNodeById,
            "getCellNodeByIndex": getCellNodeByIndex,
            "getModel": getModel,
            "getNode": getNode,
            "getRowNodeById": getRowNodeById,
            "getRowNodeByIndex": getRowNodeByIndex,
            "isCellVisible": isCellVisible,
            "isColumnVisible": isColumnVisible,
            "isHorisontalScrollVisible": isHorisontalScrollVisible,
            "isRowVisible": isRowVisible,
            "isSuspended": isSuspended,
            "isVerticalScrollVisible": isVerticalScrollVisible,
            "render": render,
            "resize": resize,
            "resizeColumns": resizeColumns,
            "resumeRender": resumeRender,
            "suspendRender": suspendRender,

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

            "onCellClick": new SmallGrid.Event.Handler(),
            "onCellContextMenu": new SmallGrid.Event.Handler(),
            "onCellDblClick": new SmallGrid.Event.Handler(),
            "onCellKeyDown": new SmallGrid.Event.Handler(), // not working?

            "onColumnResize": new SmallGrid.Event.Handler(),
            "onColumnResizeStart": new SmallGrid.Event.Handler(),
            "onColumnResizeStop": new SmallGrid.Event.Handler(),

            "onAfterRowsRendered": new SmallGrid.Event.Handler(),
            "onBeforeRowsRendered": new SmallGrid.Event.Handler(),

            "onInitialize": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });
    }


    function CreateView(container, viewModel, settings) {
        var $container = $(container);
        if (!$container.length) {
            throw new Error("Small grid requires a valid container, " + container + " does not exist in the DOM.");
        }
        var renderer = SmallGrid.View.Renderer.Create(settings);
        return new ViewData($container, viewModel, renderer, settings).init();
    }

})(jQuery);