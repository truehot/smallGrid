(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "View": {
            "Create": CreateView,
            "View": ViewData
        }
    });

    function ViewData($container, viewModel, builder, settings) {
        var self = this,
            contentSize =
            {
                width: 0,
                height: 0
            },
            modelSize = {
                rowsHeight: 0,
                columnsWidth: 0
            },
            el = {},
            handlers = [],
            requestDataCounter = null,
            requestRenderTimer = null,
            renderDelayTimer = null,
            scrollVisibility =
            {
                horisontal: false,
                vertical: false
            },
            suspendRequests = [],
            suspendScrollEvent = false,
            suspendRenderRequests = 0;

        el = builder.buildViewPortElements($container);
        el.container.empty().addClass(settings.uid);
        el.viewport.appendTo(el.container);

        /*Init and destroy*/
        function init() {
            var request = suspendRender();

            //bind events
            handlers.push(
                SmallGrid.Handler.Resize.Create(el.header, {
                    "handleResize": handleHeaderResize,
                    "handleResizeStart": handleHeaderResizeStart,
                    "handleResizeStop": handleHeaderResizeStop,
                    "handlerIdentifier": "." + settings.cssClass.headerResizeHandle
                }),
                SmallGrid.Handler.Click.Create(el.header, {
                    "handleClick": handleHeaderClick,
                    "handleDblClick": handleHeaderDblClick,
                    "handleContextMenu": handleHeaderContextMenu
                }),
                SmallGrid.Handler.Click.Create(el.content, {
                    "handleClick": handleCellClick,
                    "handleDblClick": handleCellDblClick,
                    "handleContextMenu": handleCellContextMenu,
                    "handleKeyDown": handleCellKeyDown
                }),
                SmallGrid.Handler.Scroll.Create(el.content, {
                    "handleScrollStart": handleScrollStart,
                    "handleScrollStop": handleScrollStop,
                    "handleScroll": handleScroll,
                    "handleMouseWheelStart": handleMouseWheelStart,
                    "handleMouseWheelStop": handleMouseWheelStop,
                    "handleMouseWheel": handleMouseWheel
                })
            );

            var sharedHandler = SmallGrid.Handler.Shared.GetInstance();
            sharedHandler.onClick.subscribe(handleDocumentClick);
            sharedHandler.onResize.subscribe(handleDocumentResize);
            sharedHandler.onContextMenu.subscribe(handleDocumentContextMenu);

            viewModel.onRowsChange.subscribe(handleRowsChange);
            viewModel.onColumnsChange.subscribe(handleColumnsChange);
            viewModel.onInitialize.subscribe(handleModelInit);

            resumeRender(request);

            return self;
        }

        function destroy() {
            suspendRender();

            clearTimeout(requestRenderTimer);
            clearTimeout(renderDelayTimer);

            viewModel.onRowsChange.unsubscribe(handleRowsChange);
            viewModel.onColumnsChange.unsubscribe(handleColumnsChange);
            viewModel.onInitialize.unsubscribe(handleModelInit);

            var sharedHandler = SmallGrid.Handler.Shared.GetInstance();
            sharedHandler.onClick.unsubscribe(handleDocumentClick);
            sharedHandler.onResize.unsubscribe(handleDocumentResize);
            sharedHandler.onContextMenu.unsubscribe(handleDocumentContextMenu);

            if (el.container.length) {
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].destroy();
                    handlers[i] = undefined;
                }

                el.container.removeClass(settings.uid);
                delete el.container;
            }

            var elKeys = Object.keys(el);
            for (var idx = 0; idx < elKeys.length; idx++) {
                el[elKeys[idx]].empty().remove();
                delete el[elKeys[idx]];
            }

            $container.empty();
        }

        function handleModelInit() {
            var request = suspendRender();
            resize();
            renderView();
            resumeRender(request);

            self.onInitialize.notify({});
        }

        /*
         Other
         */
        function getContentSize() {
            return contentSize;
        }

        function getBuilder() {
            return builder;
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
                return row.calcHeight - row.height - settings.cellOuterSize.height >= el.content[0].scrollTop && row.calcHeight + row.height + settings.cellOuterSize.height < contentSize.height + el.content[0].scrollTop;

            }
            return false;
        }

        function getRowNodeByIndex(rowIndex) {
            return el.contentTbody[0].rows[rowIndex];
        }

        function getRowNodeById(rowId) {
            var rowIndex = viewModel.getRowIndexById(rowId);
            if (rowIndex !== -1) {
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
            if (el.contentTbody[0].rows[rowIndex] && el.contentTbody[0].rows[rowIndex].cells[columnIndex]) {
                return el.contentTbody[0].rows[rowIndex].cells[columnIndex];
            }
        }

        function getCellNodeById(columnId, rowId) {
            var rowIndex = viewModel.getRowIndexById(rowId);
            var columnIndex = viewModel.getColumnIndexById(columnId);
            if (rowIndex !== -1 && columnIndex !== -1) {
                return getCellNodeByIndex(columnIndex, rowIndex);
            }
        }

        /*
        Column func
        */
        function isColumnVisible(columnId) {
            var column = viewModel.getColumnById(columnId);
            if (column) {
                return column.calcWidth - column.width - settings.cellOuterSize.width >= el.content[0].scrollLeft && column.calcWidth < contentSize.width + el.content[0].scrollLeft;
            }
            return false;
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
            if (suspendRenderRequests > 0) {
                if (requestDataCounter !== null || isSuspended() === true) {
                    clearTimeout(requestRenderTimer);
                    requestRenderTimer = setTimeout(render, 187);
                } else {
                    requestDataCounter++;
                    clearTimeout(requestRenderTimer);
                    renderView();
                    if (settings.renderDelay) {
                        renderDelayTimer = setTimeout(function () {
                            requestDataCounter = null;
                        }, settings.renderDelay);
                    } else {
                        requestDataCounter = null;
                    }
                }
            }
            return self;
        }

        function renderView() {

            var request = suspendRender();

            suspendRenderRequests = 0;

            var heightRatio = 1;
            if (modelSize.rowsHeight >= settings.maxSupportedCssHeight) {
                var contentSizeHeight = contentSize.height + (scrollVisibility.horisontal ? settings.scrollbarDimensions.height : 0);
                heightRatio = (modelSize.rowsHeight - contentSizeHeight) / (settings.maxSupportedCssHeight - contentSizeHeight);
            }

            var result = viewModel.requestDataFromRange(
                {
                    top: el.content[0].scrollTop * heightRatio,
                    left: el.content[0].scrollLeft
                },
                contentSize,
                settings.cellOuterSize,
                {
                    width: scrollVisibility.vertical ? settings.scrollbarDimensions.width : 0,
                    height: scrollVisibility.horisontal ? settings.scrollbarDimensions.height : 0
                },
                heightRatio === 1
            );

            if (result.isCached === 0) {
                if (result.columns.length > 0) {
                    el.headerTable.css({
                        'left': result.columns[0].calcWidth - result.columns[0].width - settings.cellOuterSize.width
                    });

                    if (result.rows.length > 0) {
                        el.contentTable.css({
                            'top': result.rows[0].calcHeight - result.rows[0].height - settings.cellOuterSize.height - el.content[0].scrollTop * heightRatio + el.content[0].scrollTop,
                            'left': result.columns[0].calcWidth - result.columns[0].width - settings.cellOuterSize.width
                        });
                    }

                    var lastColumn = result.columns[result.columns.length - 1];

                    var opts = {
                        hideRowBorder: scrollVisibility.horisontal === false && scrollVisibility.vertical === true,
                        hideColumnBorder: scrollVisibility.vertical === false && contentSize.width <= lastColumn.calcWidth,
                        virtualColumnWidth: settings.showLastColumn === true && contentSize.width >= lastColumn.calcWidth ? contentSize.width - lastColumn.calcWidth : 0
                    };

                    renderViewHtml(
                        builder.buildHeaderColumnsHtml(result.columns, opts),
                        builder.buildColsHtml(result.columns, opts),
                        builder.buildRowsHtml(result.columns, result.rows, opts)
                    );

                } else {
                    renderViewHtml("", "", "");
                }
            }

            resumeRender(request);
        }

        function renderViewHtml(columnsHtml, colsHtml, rowsHtml) {
            self.onBeforeRowsRendered.notify({});

            var contentTbody = el.contentTbody[0].cloneNode(false);
            var headerTbody = el.headerTbody[0].cloneNode(false);
            var headerCol = el.headerCol[0].cloneNode(false);
            var contentCol = el.contentCol[0].cloneNode(false);

            headerCol.innerHTML = contentCol.innerHTML = colsHtml;
            contentTbody.innerHTML = rowsHtml;
            headerTbody.innerHTML = columnsHtml;

            if (el.contentCol[0].innerHTML !== contentCol.innerHTML) {
                el.contentTable[0].replaceChild(contentCol, el.contentCol[0]);
                el.contentCol = $(contentCol);
            }

            if (el.contentTbody[0].innerHTML !== contentTbody.innerHTML) {
                el.contentTable[0].replaceChild(contentTbody, el.contentTbody[0]);
                el.contentTbody = $(contentTbody);
            }

            if (el.headerCol[0].innerHTML !== headerCol.innerHTML) {
                el.headerTable[0].replaceChild(headerCol, el.headerCol[0]);
                el.headerCol = $(headerCol);
            }

            if (el.headerTbody[0].innerHTML !== headerTbody.innerHTML) {
                el.headerTable[0].replaceChild(headerTbody, el.headerTbody[0]);
                el.headerTbody = $(headerTbody);
            }

            self.onAfterRowsRendered.notify({});
        }

        function isSuspended() {
            return suspendRequests.length > 0;
        }

        function suspendRender(callback) {
            var id = SmallGrid.Utils.createGuid();
            suspendRequests.push(id);
            if (callback) {
                callback();
                return resumeRender(id);
            }
            return id;
        }

        function resumeRender(value) {
            for (var i = 0; i < suspendRequests.length; i++) {
                if (suspendRequests[i] === value) {
                    suspendRequests.splice(i, 1);
                    return true;
                }
            }
            return false;
        }

        /*
        Calc private funcs
        */
        function getColumnEventType(targetClass, column) {
            var type = "";
            if (column.resizeable && targetClass.indexOf(settings.cssClass.headerResizeHandle) !== -1) {
                type = "resize";
            } else if (column.filterable && targetClass.indexOf(settings.cssClass.headerFilter) !== -1) {
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

        function getColumnEvent(evt) {
            var column = viewModel.getColumnByIndex(evt.cellIndex);
            if (column) {
                evt.type = getColumnEventType($(evt.event.target).attr("class"), column);
                evt.targetClass = $(evt.event.target).attr("class");
                evt.column = column;
                return evt;
            }
        }

        function getCellEvent(evt) {
            var column = viewModel.getColumnByIndex(evt.cellIndex);
            var row = viewModel.getRowByIndex(evt.rowIndex);

            if (column && column.field.length > 0 && row && column.field in row.item) {

                evt.type = getCellEventType($(evt.event.target).attr("class"), column, row);
                evt.row = row;
                evt.column = column;

                return evt;
            }
        }

        /*
        Resize 
        */
        function resize() {
            contentSize.width = el.container.width();
            contentSize.height = Math.max(el.container.height() - settings.header.height - settings.cellOuterSize.height, 0);

            if (contentSize.height) el.content.height(contentSize.height);

            applyRowsChange();
            applyColumnsChange();

            self.onViewResized.notify({});

            return self;
        }

        /*
        Data handlers
        */
        function applyRowsChange() {

            modelSize.rowsHeight = viewModel.getRowsHeight(settings.cellOuterSize);

            scrollVisibility.vertical = scrollVisibility.horisontal ? modelSize.rowsHeight > contentSize.height - settings.scrollbarDimensions.height : modelSize.rowsHeight > contentSize.height;

            //for rigth corner in the header
            el.header.css({
                'width': scrollVisibility.vertical ? contentSize.width - settings.scrollbarDimensions.width : contentSize.width
            });

            el.contentWrap.css({
                'height': getWrapHeight()
            });
        }

        function applyColumnsChange() {

            modelSize.columnsWidth = viewModel.getColumnsWidth(settings.cellOuterSize);

            scrollVisibility.horisontal = scrollVisibility.vertical ? modelSize.columnsWidth > contentSize.width - settings.scrollbarDimensions.width : modelSize.columnsWidth > contentSize.width;

            var width = getWrapWidth();

            el.headerWrap.css({
                'width': width
            });

            el.contentWrap.css({
                'width': width
            });
        }

        function getWrapHeight() {
            return Math.min(modelSize.rowsHeight, settings.maxSupportedCssHeight);
        }

        function getWrapWidth() {
            return Math.max(
                modelSize.columnsWidth,
                scrollVisibility.vertical ? contentSize.width - settings.scrollbarDimensions.width : contentSize.width
            );
        }

        function handleRowsChange() {
            applyRowsChange();
            render();
        }

        function handleColumnsChange() {
            applyColumnsChange();
            render();
        }

        /*
        Handle cell events
        */
        function handleCellClick(evt) {
            var cellEvent = getCellEvent(evt);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellClick");
            }
        }

        function handleCellDblClick(evt) {
            var cellEvent = getCellEvent(evt);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellDblClick");
            }
        }

        function handleCellContextMenu(evt) {
            var cellEvent = getCellEvent(evt);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellContextMenu");
            }
        }

        function handleCellKeyDown(evt) {
            var cellEvent = getCellEvent(evt);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellKeyDown");
            }
        }

        /*
        Handle resize events
        */
        function handleHeaderResize(evt) {
            notifyEvent(evt, "onColumnResize");
        }

        function handleHeaderResizeStart(evt) {
            suspendScrollEvent = true;
            notifyEvent(evt, "onColumnResizeStart");
        }

        function handleHeaderResizeStop(evt) {
            suspendScrollEvent = false;
            notifyEvent(evt, "onColumnResizeStop");
        }

        /*
        Handle mouse wheel
        */
        function handleMouseWheelStart(evt) {
            notifyEvent(evt, "onMouseWheelStart");
        }

        function handleMouseWheelStop(evt) {
            notifyEvent(evt, "onMouseWheelStop");
        }

        function handleMouseWheel(evt) {
            notifyEvent(evt, "onMouseWheel");
        }

        /*
        Handle scroll
        */
        function handleScrollStart(evt) {
            if (suspendScrollEvent === false) {
                notifyEvent(evt, "onScrollStart");
            }
        }

        function handleScrollStop(evt) {
            if (suspendScrollEvent === false) {
                notifyEvent(evt, "onScrollStop");
            }
        }

        function handleScroll(evt) {
            if (suspendScrollEvent === false) {
                el.header[0].scrollLeft = el.content[0].scrollLeft;
                render();
                notifyEvent(evt, "onScroll");
            }
        }

        /*
        Handle document events
        */
        function handleDocumentResize(evt) {
            suspendRender(function () {
                notifyEvent(evt, "onDocumentResize");
                resize();
                renderView();
            });
        }

        function handleDocumentContextMenu(evt) {
            notifyEvent(evt, "onDocumentContextMenu");
        }

        function handleDocumentClick(evt) {
            notifyEvent(evt, "onDocumentClick");
        }

        /*
        Handle header events
        */
        function handleHeaderClick(evt) {
            var columnEvent = getColumnEvent(evt);
            if (columnEvent) {
                notifyEvent(columnEvent, "onHeaderClick");
            }
        }

        function handleHeaderContextMenu(evt) {
            var columnEvent = getColumnEvent(evt);
            if (columnEvent) {
                notifyEvent(columnEvent, "onHeaderContextMenu");
            }
        }

        function handleHeaderDblClick(evt) {
            var columnEvent = getColumnEvent(evt);
            if (columnEvent) {
                notifyEvent(columnEvent, "onHeaderDblClick");
            }
        }

        function notifyEvent(evt, handlerName) {
            self[handlerName].notify(evt);
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "getBuilder": getBuilder,
            "getContentSize": getContentSize,

            "getCellNodeById": getCellNodeById,
            "getCellNodeByIndex": getCellNodeByIndex,
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

            "resumeRender": resumeRender,
            "suspendRender": suspendRender,

            "onViewResized": new SmallGrid.Event.Handler(),

            "onScroll": new SmallGrid.Event.Handler(),
            "onScrollStart": new SmallGrid.Event.Handler(),
            "onScrollStop": new SmallGrid.Event.Handler(),

            "onMouseWheel": new SmallGrid.Event.Handler(),
            "onMouseWheelStart": new SmallGrid.Event.Handler(),
            "onMouseWheelStop": new SmallGrid.Event.Handler(),

            "onDocumentClick": new SmallGrid.Event.Handler(),
            "onDocumentResize": new SmallGrid.Event.Handler(),
            "onDocumentContextMenu": new SmallGrid.Event.Handler(),

            "onHeaderClick": new SmallGrid.Event.Handler(),
            "onHeaderContextMenu": new SmallGrid.Event.Handler(),
            "onHeaderDblClick": new SmallGrid.Event.Handler(),

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
            "onDestroy": new SmallGrid.Event.Handler()
        });
    }


    function CreateView(container, viewModel, settings, autoInit) {
        var $container = $(container);
        if (!$container.length) {
            throw new TypeError("Container is not defined or does not exist in the DOM.");
        }

        if ($container.length !== 1) {
            throw new TypeError("There should be only 1 container.");
        }

        if (viewModel instanceof SmallGrid.View.Model.Model === false) {
            throw new TypeError("View model is not defined.");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        var builder = SmallGrid.View.Builder.Create(settings);

        var view = new ViewData($container, viewModel, builder, settings);
        if (autoInit !== false) view.init();
        return view;
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});