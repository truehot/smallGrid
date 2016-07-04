(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "View": {
            "Model": {
                "Model": ViewModel,
                "Create": CreateModel
            }
        }
    });

    function ViewModel(rowsModel, columnsModel, settings) {
        var self = this;
        var rowsTotal = { count: 0, height: 0 };
        var columnsTotal = { count: 0, width: 0 };

        var rowsCache = [];
        var columnsCache = [];

        var rowsFilters = [];
        var columnsFilters = [];
        var rowsSorters = [];
        var columnsSorters = [];

        var cachedRange = {
            minTop: undefined,
            maxTop: undefined,
            minLeft: undefined,
            maxLeft: undefined
        };

        /*
        Init && destroy
        */
        function init() {
            rowsModel.onChange.subscribe(handleRowsChange);
            columnsModel.onChange.subscribe(handleColumnsChange);

            self.onInitialize.notify({});
            return self;
        }

        function destroy() {
            rowsModel.onChange.unsubscribe(handleRowsChange);
            columnsModel.onChange.unsubscribe(handleColumnsChange);
            rowsCache = undefined;
            columnsCache = undefined;
            rowsFilters = undefined;
            columnsFilters = undefined;
            rowsSorters = undefined;
        }

        /*
        Handlers
        */
        function handleColumnsChange(evt) {
            updateCacheWidth();

            if (evt.data) {
                var stackedIds = [];
                for (var i = 0; i < evt.data.length; i++) {
                    if (evt.data[i].id) {
                        stackedIds.push(evt.data[i].id);
                    }
                }
                self.onColumnsChange.notify({ "ids": stackedIds });

            } else if (evt.id) {
                self.onColumnsChange.notify({ "ids": [evt.id] });
            }
        }

        function handleRowsChange(evt) {
            updateCacheHeight();

            if (evt.data) {
                var stackedIds = [];
                for (var i = 0; i < evt.data.length; i++) {
                    if (evt.data[i].id) {
                        stackedIds.push(evt.data[i].id);
                    }
                }
                self.onRowsChange.notify({ "ids": stackedIds });

            } else if (evt.id) {
                self.onRowsChange.notify({ "ids": [evt.id] });
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
                if (rowsCache[i].id === id) {
                    return i;
                }
            }
            return -1;
        }

        function getColumnIndexById(id) {
            for (var i = 0; i < columnsCache.length; i++) {
                if (columnsCache[i].id === id) {
                    return i;
                }
            }
            return -1;
        }

        function getRowById(id) {
            for (var i = 0; i < rowsCache.length; i++) {
                if (rowsCache[i].id === id) {
                    return rowsCache[i];
                }
            }
        }

        function getColumnById(id) {
            for (var i = 0; i < columnsCache.length; i++) {
                if (columnsCache[i].id === id) {
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
                    if (rowsFilters[i].getId() === filterObj.getId()) {
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
                    if (rowsFilters[i].getId() === filterObj.getId()) {
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
                    if (rowsSorters[i].getField() === sorterObj.getField()) {
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
            var rowsCached = (cachedRange.minTop <= point.top && point.top <= cachedRange.maxTop + scrollSize.height) & allowCache;
            var columnsCached = (cachedRange.minLeft <= point.left && point.left <= cachedRange.maxLeft + scrollSize.width) & allowCache;

            if (rowsCached === 0) {
                rowsCache = new SmallGrid.Query.Request(rowsFilters, rowsSorters, rowsModel).getRowsInRange(point.top, size.height, outerSize.height);
                updateCacheHeight(rowsCache, size, outerSize);
            }

            if (columnsCached === 0) {
                columnsCache = new SmallGrid.Query.Request(columnsFilters, columnsSorters, columnsModel).getColumnsInRange(point.left, size.width, outerSize.width);
                updateCacheWidth(columnsCache, size, outerSize);
            }

            return {
                isCached: rowsCached && columnsCached,
                rows: rowsCache,
                columns: columnsCache
            };
        }

        /*
        Cache range
        */
        function updateCacheWidth(columns, size, outerSize) {
            if (columns && columns.length) {
                cachedRange.minLeft = columns[0].calcWidth - columns[0].width - outerSize.width;
                cachedRange.maxLeft = columns[(columns.length - 1)].calcWidth > size.width ? columns[(columns.length - 1)].calcWidth - size.width : size.width;

            } else {
                cachedRange.minLeft = undefined;
                cachedRange.maxLeft = undefined;
            }
        }

        function updateCacheHeight(rows, size, outerSize) {
            if (rows && rows.length) {
                cachedRange.minTop = rows[0].calcHeight - rows[0].height - outerSize.height;
                cachedRange.maxTop = rows[(rows.length - 1)].calcHeight > size.height ? rows[(rows.length - 1)].calcHeight - size.height : size.height;
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
            "onInitialize": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler()
        });
    }

    function CreateModel(rowsModel, columnsModel, settings, autoInit) {
        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        if (rowsModel instanceof SmallGrid.Row.Model === false) {
            throw new TypeError("Rows model is not defined.");
        }

        if (columnsModel instanceof SmallGrid.Column.Model === false) {
            throw new TypeError("Column model is not defined.");
        }

        var viewModel = new ViewModel(rowsModel, columnsModel, settings);
        if (autoInit !== false) viewModel.init();
        return viewModel;
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});