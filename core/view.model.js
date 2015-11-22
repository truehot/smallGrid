(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "View": {
                "Model": {
                    "Model": ViewModel,
                    "Create": CreateModel,
                }
            }
        }
    });

    function ViewModel(rowsModel, columnsModel, settings) {
        var self = this;
        var columns = columnsModel;
        var rows = rowsModel;

        var rowsCache = [];
        var columnsCache = [];

        var rowsFilters = [];
        var columnsFilters = [];
        var rowsSorters = [];
        var columnsSorters = [];


        var bulkColumns = [];
        var bulkRows = [];

        var cachedRange = {
            minTop: -1,
            maxTop: -1,
            minLeft: -1,
            maxLeft: -1,
        };

        /*
        Init && destroy
        */
        function init() {
            rowsModel.onChange.subscribe(handleRowsChange);
            rowsModel.onChangeStart.subscribe(handleRowsChangeStart);
            rowsModel.onChangeStop.subscribe(handleRowsChangeStop);

            columnsModel.onChange.subscribe(handleColumnsChange);
            columnsModel.onChangeStart.subscribe(handleColumnsChangeStart);
            columnsModel.onChangeStop.subscribe(handleColumnsChangeStop);
            return self;
        }

        function destroy() {
            rowsModel.onChange.unsubscribe(handleRowsChange);
            rowsModel.onChangeStart.unsubscribe(handleRowsChangeStart);
            rowsModel.onChangeStop.unsubscribe(handleRowsChangeStop);

            columnsModel.onChange.unsubscribe(handleColumnsChange);
            columnsModel.onChangeStart.unsubscribe(handleColumnsChangeStart);
            columnsModel.onChangeStop.unsubscribe(handleColumnsChangeStop);
        }

        /*
        Handlers
        */
        function handleColumnsChange(event) {

            if (bulkColumns.length === 0 && event.id) {
                resetCacheRangeWidth();
                self.onColumnsChange.notify();
            } else if (event.id) {
                bulkColumns.push(event.id);
            }
        }

        function handleRowsChange(event) {
            if (bulkRows.length === 0 && event.id) {
                resetCacheRangeHeight();
                self.onRowsChange.notify();
            } else if (event.id) {
                bulkRows.push(event.id);
            }
        }

        function handleColumnsChangeStart() {
            bulkColumns = [];
        }

        function handleRowsChangeStart() {
            bulkRows = [];
        }

        function handleColumnsChangeStop(event) {
            if ((event.mode && event.mode == "all") || bulkColumns.length > 0) {
                bulkColumns = [];
                resetCacheRangeWidth();
                self.onColumnsChange.notify();
            }
        }

        function handleRowsChangeStop(event) {
            if ((event.mode && event.mode == "all") || bulkRows.length > 0) {
                bulkRows = [];
                resetCacheRangeHeight();
                self.onRowsChange.notify();
            }
        }

        /*
        Row and column helpers
        */
        function getRows() {
            return rowsCache;
        }
        function getColumns() {
            return columnsCache;
        }

        function getRowByIndex(idx) {
            return rowsCache[idx];
        }

        function getColumnByIndex(idx) {
            return columnsCache[idx];
        }

        function getRowIndexById(id) {
            for (var i = 0; i < rowsCache.length; i++) {
                if (rowsCache[i].id == id) {
                    return i;
                }
            }
            return -1;
        }

        function getColumnIndexById(id) {
            for (var i = 0; i < columnsCache.length; i++) {
                if (columnsCache[i].id == id) {
                    return i;
                }
            }
            return -1;
        }

        function getRowById(id) {
            for (var i = 0; i < rowsCache.length; i++) {
                if (rowsCache[i].id == id) {
                    return rowsCache[i];
                }
            }
        }

        function getColumnById(id) {
            for (var i = 0; i < columnsCache.length; i++) {
                if (columnsCache[i].id == id) {
                    return columnsCache[i];
                }
            }
        }

        /*
        Filter part
        */
        function getFilters() {
            return rowsFilters;
        }

        function setFilter(filterObj) {
            if (filterObj instanceof SmallGrid.Query.FilterQuery) {
                clearFilter(filterObj);
                rowsFilters.push(filterObj);
                resetCacheRangeHeight();
                self.onRowsChange.notify();
            }
        }

        function clearFilter(filterObj) {
            if (filterObj instanceof SmallGrid.Query.FilterQuery) {
                for (var i = 0; i < rowsFilters.length; i++) {
                    if (rowsFilters[i].getId() == filterObj.getId()) {
                        rowsFilters.splice(i, 1);
                        resetCacheRangeHeight();
                        self.onRowsChange.notify();
                        break;
                    }
                }
            }
        }

        function clearFilters() {
            rowsFilters = [];
            resetCacheRangeHeight();
            self.onRowsChange.notify();
        }

        /* 
        Sorter part
        */
        function getSorters() {
            return rowsSorters;
        }

        function setSorter(sorterObj) {
            if (sorterObj instanceof SmallGrid.Query.SorterQuery) {
                clearSorters();
                rowsSorters.push(sorterObj);
                resetCacheRangeHeight();
                self.onRowsChange.notify();
            }
        }

        function clearSorter(sorterObj) {
            if (sorterObj instanceof SmallGrid.Query.SorterQuery) {
                for (var i = 0; i < rowsSorters.length; i++) {
                    if (rowsSorters[i].getField() == sorterObj.getField()) {
                        rowsSorters.splice(i, 1);
                        resetCacheRangeHeight();
                        self.onRowsChange.notify();
                        break;
                    }
                }
            }
        }

        function clearSorters() {
            rowsSorters = [];
            resetCacheRangeHeight();
            self.onRowsChange.notify();
        }

        /*
        Data calculations
        */
        function getRowsHeight(cellOuterSize) {
            return new SmallGrid.Query.Request(rowsFilters, rowsSorters, rowsModel).getRowsHeight(cellOuterSize.height);
        }

        function getColumnsWidth(cellOuterSize) {
            return new SmallGrid.Query.Request(columnsFilters, columnsSorters, columnsModel).getColumnsWidth(cellOuterSize.width);
        }

        function requestDataFromRange(point, size, outerSize, allowCache) {

            var rowsCached = (cachedRange.minTop <= point.top && point.top <= cachedRange.maxTop) & allowCache;
            var columnsCached = (cachedRange.minLeft <= point.left && point.left <= cachedRange.maxLeft) & allowCache;

            if (rowsCached === 0 || columnsCached === 0) {
                if (rowsCached === 0) {
                    rowsCache = new SmallGrid.Query.Request(rowsFilters, rowsSorters, rowsModel).getRowsInRange(point.top, size.height, outerSize.height);
                }

                if (columnsCached === 0) {
                    columnsCache = new SmallGrid.Query.Request(columnsFilters, columnsSorters, columnsModel).getColumnsInRange(point.left, size.width, outerSize.width);
                }

                updateCacheRange(size, outerSize);
            }

            return {
                isCached: (rowsCached && columnsCached),
                rows: rowsCache,
                columns: columnsCache,
            };
        }

        /*
        Cache range
        */
        function updateCacheRange(size, outerSize) {
            if (columnsCache.length && rowsCache.length) {
                cachedRange = {
                    minTop: rowsCache[0].calcHeight < size.height ? rowsCache[0].calcHeight - rowsCache[0].height - outerSize.height : rowsCache[0].calcHeight + size.height,
                    maxTop: rowsCache[(rowsCache.length - 1)].calcHeight < size.height ? size.height : rowsCache[(rowsCache.length - 1)].calcHeight - size.height,
                    minLeft: columnsCache[0].calcWidth < size.width ? columnsCache[0].calcWidth - columnsCache[0].width - outerSize.width : columnsCache[0].calcWidth + size.width,
                    maxLeft: columnsCache[(columnsCache.length - 1)].calcWidth < size.width ? size.width : columnsCache[(columnsCache.length - 1)].calcWidth - size.width,
                };
            } else {
                resetCacheRange();
            }
        }

        function resetCacheRangeHeight() {
            cachedRange.minTop = -1;
            cachedRange.maxTop = -1;
        }

        function resetCacheRangeWidth() {
            cachedRange.minLeft = -1;
            cachedRange.maxLeft = -1;
        }

        function resetCacheRange() {
            resetCacheRangeHeight();
            resetCacheRangeWidth();
        }



        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "columns": columns,
            "rows": rows,

            "resetCacheRange": resetCacheRange,
            "requestDataFromRange": requestDataFromRange,

            "clearSorter": clearSorter,
            "clearSorters": clearSorters,
            "clearFilter": clearFilter,
            "clearFilters": clearFilters,
            "getColumnById": getColumnById,
            "getColumnByIndex": getColumnByIndex,
            "getColumnIndexById": getColumnIndexById,
            "getColumns": getColumns,
            "getColumnsWidth": getColumnsWidth,
            "getFilters": getFilters,
            "getSorters": getSorters,
            "getRowById": getRowById,
            "getRowByIndex": getRowByIndex,
            "getRowIndexById": getRowIndexById,
            "getRows": getRows,
            "getRowsHeight": getRowsHeight,
            "setFilter": setFilter,
            "setSorter": setSorter,


            "onColumnsChange": new SmallGrid.Event.Handler(),
            "onRowsChange": new SmallGrid.Event.Handler(),
        });
    }

    function CreateModel(rowsModel, columnsModel, settings) {
        return new ViewModel(rowsModel, columnsModel, settings).init();
    }

})(jQuery);