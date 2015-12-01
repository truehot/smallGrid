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

        var rowsTotal = { count: 0, height: 0 };
        var columnsTotal = { count: 0, width: 0 };

        var rowsCache = [];
        var columnsCache = [];

        var rowsFilters = [];
        var columnsFilters = [];
        var rowsSorters = [];
        var columnsSorters = [];


        var bulkColumns = [];
        var bulkRows = [];

        var cachedRange = {
            minTop: undefined,
            maxTop: undefined,
            minLeft: undefined,
            maxLeft: undefined,
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
        function handleColumnsChange(evt) {

            if (bulkColumns.length === 0 && evt.id) {
                updateCacheWidth();
                self.onColumnsChange.notify({ ids: [evt.id] });
            } else if (evt.id) {
                bulkColumns.push(evt.id);
            }
        }

        function handleRowsChange(evt) {
            if (bulkRows.length === 0 && evt.id) {
                updateCacheHeight();
                self.onRowsChange.notify({ ids: [evt.id] });
            } else if (evt.id) {
                bulkRows.push(evt.id);
            }
        }

        function handleColumnsChangeStart() {
            bulkColumns = [];
        }

        function handleRowsChangeStart() {
            bulkRows = [];
        }

        function handleColumnsChangeStop(evt) {
            if ((evt.mode && evt.mode == "all") || bulkColumns.length > 0) {
                updateCacheWidth();
                self.onColumnsChange.notify({ ids: bulkColumns });
                bulkColumns = [];
            }
        }

        function handleRowsChangeStop(evt) {
            if ((evt.mode && evt.mode == "all") || bulkRows.length > 0) {
                updateCacheHeight();
                self.onRowsChange.notify({ ids: bulkRows });
                bulkRows = [];
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

        function getRowsTotal() {
            return rowsTotal;
        }

        function getColumnsTotal() {
            return columnsTotal;
        }

        /*
        Filter part
        */
        function getFilters() {
            return rowsFilters;
        }

        function setFilter(filterObj) {
            if (filterObj instanceof SmallGrid.Query.FilterQuery) {
                for (var i = 0; i < rowsFilters.length; i++) {
                    if (rowsFilters[i].getId() == filterObj.getId()) {
                        break;
                    }
                }

                rowsFilters[i] = filterObj;
                updateCacheHeight();
                self.onRowsChange.notify();
            }
        }

        function clearFilter(filterObj) {
            if (filterObj instanceof SmallGrid.Query.FilterQuery) {
                for (var i = 0; i < rowsFilters.length; i++) {
                    if (rowsFilters[i].getId() == filterObj.getId()) {
                        rowsFilters.splice(i, 1);
                        updateCacheHeight();
                        self.onRowsChange.notify();
                        break;
                    }
                }
            }
        }

        function clearFilters() {
            rowsFilters = [];
            updateCacheHeight();
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
                rowsSorters = [];
                updateCacheHeight();
                rowsSorters.push(sorterObj);
                self.onRowsChange.notify();
            }
        }

        function clearSorter(sorterObj) {
            if (sorterObj instanceof SmallGrid.Query.SorterQuery) {
                for (var i = 0; i < rowsSorters.length; i++) {
                    if (rowsSorters[i].getField() == sorterObj.getField()) {
                        rowsSorters.splice(i, 1);
                        updateCacheHeight();
                        self.onRowsChange.notify();
                        break;
                    }
                }
            }
        }

        function clearSorters() {
            rowsSorters = [];
            updateCacheHeight();
            self.onRowsChange.notify();
        }

        /*
        Data calculations
        */
        function getRowsHeight(cellOuterSize) {
            rowsTotal = new SmallGrid.Query.Request(rowsFilters, rowsSorters, rowsModel).getRowsTotal(cellOuterSize.height);
            return rowsTotal.height;
        }

        function getColumnsWidth(cellOuterSize) {
            columnsTotal = new SmallGrid.Query.Request(columnsFilters, columnsSorters, columnsModel).getColumnsTotal(cellOuterSize.width);
            return columnsTotal.width;
        }

        function requestDataFromRange(point, size, outerSize, scrollSize, allowCache) {
            var rowsCached = (cachedRange.minTop <= point.top && point.top <= cachedRange.maxTop + scrollSize.width) & allowCache;
            var columnsCached = (cachedRange.minLeft <= point.left && point.left <= cachedRange.maxLeft + scrollSize.height) & allowCache;

            if (rowsCached === 0) {
                rowsCache = new SmallGrid.Query.Request(rowsFilters, rowsSorters, rowsModel).getRowsInRange(point.top, size.height, outerSize.height);
                updateCacheHeight(rowsCache, size, outerSize);
            }

            if (columnsCached === 0) {
                columnsCache = new SmallGrid.Query.Request(columnsFilters, columnsSorters, columnsModel).getColumnsInRange(point.left, size.width, outerSize.width);
                updateCacheWidth(columnsCache, size, outerSize);
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
        function updateCacheWidth(columns, size, outerSize) {
            if (columns && columns.length) {
                cachedRange.minLeft = columns[0].calcWidth < size.width ? columns[0].calcWidth - columns[0].width - outerSize.width : columns[0].calcWidth + size.width;
                cachedRange.maxLeft = columns[(columns.length - 1)].calcWidth < size.width ? size.width : columns[(columns.length - 1)].calcWidth - size.width;
            } else {
                cachedRange.minLeft = undefined;
                cachedRange.maxLeft = undefined;
            }
        }

        function updateCacheHeight(rows, size, outerSize) {
            if (rows && rows.length) {
                cachedRange.minTop = rows[0].calcHeight < size.height ? rows[0].calcHeight - rows[0].height - outerSize.height : rows[0].calcHeight + size.height;
                cachedRange.maxTop = rows[(rows.length - 1)].calcHeight < size.height ? size.height : rows[(rows.length - 1)].calcHeight - size.height;
            } else {
                cachedRange.minTop = undefined;
                cachedRange.maxTop = undefined;
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "getRowsTotal": getRowsTotal,
            "getColumnsTotal": getColumnsTotal,

            "columns": columns,
            "rows": rows,

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
        if (rowsModel instanceof SmallGrid.Row.Model === false) {
            throw new TypeError("Rows model is not defined.");
        }

        if (columnsModel instanceof SmallGrid.Column.Model === false) {
            throw new TypeError("Column model is not defined.");
        }

        return new ViewModel(rowsModel, columnsModel, settings).init();
    }

})(jQuery);