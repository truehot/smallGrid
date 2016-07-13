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

    function ViewModel(rowsModel, columnsModel, rowsRequest, columnsRequest, settings) {
        var self = this,
            rowsTotal = { count: 0, height: 0 },
            columnsTotal = { count: 0, width: 0 };

        var rowsCache = [],
            columnsCache = [];

        var cachedRange = {
            minTop: undefined,
            maxTop: undefined,
            minLeft: undefined,
            maxLeft: undefined
        };

        var rowFilters = [],
            rowSorters = [],
            newRowSorters = [];

        /*
         * Init && destroy
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
            rowFilters = [];
            rowSorters = [];
            newRowSorters = [];
            rowsCache = undefined;
            columnsCache = undefined;
        }

        /*
         * Handlers
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
            newRowSorters = rowSorters.slice();
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
         * Cached row and column helpers
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
         * Row filters part
         */
        function getFilters() {
            return rowFilters;
        }

        function setFilter(filterObj) {
            if (filterObj instanceof SmallGrid.Query.Filter) {
                for (var i = 0; i < rowFilters.length; i++) {
                    if (rowFilters[i].getId() === filterObj.getId()) {
                        break;
                    }
                }
                rowFilters[i] = filterObj;
                updateCacheHeight();
                self.onRowsChange.notify();
            }
        }

        function clearFilterByField(field) {
            for (var i = 0; i < rowFilters.length; i++) {
                if (rowFilters[i].getField() === field) {
                    rowFilters.splice(i, 1);
                    updateCacheHeight();
                    self.onRowsChange.notify();
                    break;
                }
            }
        }

        function clearFilterById(id) {
            for (var i = 0; i < rowFilters.length; i++) {
                if (rowFilters[i].getId() === id) {
                    rowFilters.splice(i, 1);
                    updateCacheHeight();
                    self.onRowsChange.notify();
                    break;
                }
            }
        }

        function clearFilters() {
            rowFilters = [];
            updateCacheHeight();
            self.onRowsChange.notify();
        }

        /* 
         * Row sorters part
         */
        function getSorters() {
            return rowSorters;
        }

        function setSorter(sorterObj) {
            if (sorterObj instanceof SmallGrid.Query.Sorter) {
                rowSorters = [sorterObj];
                newRowSorters = rowSorters.slice();
                updateCacheHeight();
                self.onRowsChange.notify();
            }
        }

        function clearSorterById(id) {
            for (var i = 0; i < rowSorters.length; i++) {
                if (rowSorters[i].getId() === id) {
                    rowSorters.splice(i, 1);
                    newRowSorters = rowSorters.slice();
                    updateCacheHeight();
                    self.onRowsChange.notify();
                    break;
                }
            }
        }

        function clearSorterByField(field) {
            for (var i = 0; i < rowSorters.length; i++) {
                if (rowSorters[i].getField() === field) {
                    rowSorters.splice(i, 1);
                    newRowSorters = rowSorters.slice();
                    updateCacheHeight();
                    self.onRowsChange.notify();
                    break;
                }
            }
        }

        function clearSorters() {
            rowSorters = [];
            newRowSorters = [];
            updateCacheHeight();
            self.onRowsChange.notify();
        }

        /*
         * Data calculations
         */
        function getRowsHeight(cellOuterSize) {
            rowsTotal = rowsRequest.getRowsTotal(cellOuterSize.height, rowFilters);
            return rowsTotal.height;
        }

        function getColumnsWidth(cellOuterSize) {
            columnsTotal = columnsRequest.getColumnsTotal(cellOuterSize.width);
            return columnsTotal.width;
        }

        function requestDataFromRange(point, size, outerSize, scrollSize, allowCache) {
            var rowsCached = (cachedRange.minTop <= point.top && point.top <= cachedRange.maxTop + scrollSize.height) & allowCache;
            var columnsCached = (cachedRange.minLeft <= point.left && point.left <= cachedRange.maxLeft + scrollSize.width) & allowCache;

            if (rowsCached === 0) {
                rowsCache = rowsRequest.getRowsInRange(point.top, size.height, outerSize.height, newRowSorters, rowFilters);
                newRowSorters = [];
                updateCacheHeight(rowsCache, size, outerSize);
            }

            if (columnsCached === 0) {
                columnsCache = columnsRequest.getColumnsInRange(point.left, size.width, outerSize.width);
                updateCacheWidth(columnsCache, size, outerSize);
            }

            return {
                isCached: rowsCached && columnsCached,
                rows: rowsCache,
                columns: columnsCache
            };
        }

        /*
         * Cache range
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

            "clearFilterByField": clearFilterByField,
            "clearFilterById": clearFilterById,
            "clearFilters": clearFilters,
            "clearSorterByField": clearSorterByField,
            "clearSorterById": clearSorterById,
            "clearSorters": clearSorters,
            "getFilters": getFilters,
            "getSorters": getSorters,
            "setFilter": setFilter,
            "setSorter": setSorter,

            "getColumnById": getColumnById,
            "getColumnByIndex": getColumnByIndex,
            "getColumnIndexById": getColumnIndexById,
            "getColumns": getColumns,
            "getColumnsWidth": getColumnsWidth,
            "getRowById": getRowById,
            "getRowByIndex": getRowByIndex,
            "getRowIndexById": getRowIndexById,
            "getRows": getRows,
            "getRowsHeight": getRowsHeight,

            "onColumnsChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
            "onInitialize": new SmallGrid.Event.Handler(),
            "onRowsChange": new SmallGrid.Event.Handler()
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

        var rowsRequest = new SmallGrid.Query.Row.Create(rowsModel);
        var columnsRequest = new SmallGrid.Query.Column.Create(columnsModel);
        var viewModel = new ViewModel(rowsModel, columnsModel, rowsRequest, columnsRequest, settings);

        if (autoInit !== false) viewModel.init();

        return viewModel;
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});