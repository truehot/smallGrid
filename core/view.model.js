"use strict";

(function ($) {
    $.extend(true, window, {
        "SmallGrid": {
            "View": {
                "Model": ViewModel
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

        var sorters = [];

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
            columnsModel.onChange.subscribe(handleColumnsChange);
            return this;
        }

        function destroy() {
            rowsModel.onChange.unsubscribe(handleRowsChange);
            columnsModel.onChange.unsubscribe(handleColumnsChange);
        }

        /*
        Handlers
        */
        function handleColumnsChange() {
            //self.onColumnsChange.notify();
            resetCacheRangeWidth();
            self.onDataChange.notify();
        }

        function handleRowsChange() {
            //self.onRowsChange.notify();
            resetCacheRangeHeight();
            self.onDataChange.notify();
        }

        /*
        Row and column helpers
        */
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
            if (filterObj instanceof settings.Filter.FilterQuery) {
                clearFilter(filterObj);
                rowsFilters.push(filterObj);

                resetCacheRangeHeight();
                self.onDataChange.notify();
            }
        }

        function setFilters(filters) {
            rowsFilters = [];
            for (var i = 0; i < filters.length; i++) {
                rowsFilters.push(filters[i]);
            }
            resetCacheRangeHeight();
            self.onDataChange.notify();
        }

        function clearFilter(filterObj) {
            if (filterObj instanceof settings.Filter.FilterQuery) {
                for (var i = 0; i < rowsFilters.length; i++) {
                    if (rowsFilters[i].getId() == filterObj.getId()) {
                        rowsFilters.splice(i, 1);

                        resetCacheRangeHeight();
                        self.onDataChange.notify();
                        break;
                    }
                }
            }
        }

        function clearFilters() {
            rowsFilters = [];

            resetCacheRangeHeight();
            self.onDataChange.notify();
        }

        /*
        Data calculations
        */
        function getRowsHeight(cellOuterSize) {
            return new settings.Filter.FilterRequest(rowsFilters, rowsModel).getRowsHeight(cellOuterSize.height);
        }

        function getColumnsWidth(cellOuterSize) {
            return new settings.Filter.FilterRequest(columnsFilters, columnsModel).getColumnsWidth(cellOuterSize.width);
        }

        function requestDataFromRange(point, size, outerSize, allowCache) {
            var rowsCached = (cachedRange.minTop <= point.top && point.top <= cachedRange.maxTop) & allowCache;
            var columnsCached = (cachedRange.minLeft <= point.left && point.left <= cachedRange.maxLeft) & allowCache;

            if (rowsCached === 0 || columnsCached === 0) {
                self.onDataChangeStart.notify();

                if (rowsCached === 0) {
                    rowsCache = new settings.Filter.FilterRequest(rowsFilters, rowsModel).getRowsInRange(point.top, size.height, outerSize.height);
                    self.onRowsChange.notify();
                }

                if (columnsCached === 0) {
                    columnsCache = new settings.Filter.FilterRequest(columnsFilters, columnsModel).getColumnsInRange(point.left, size.width, outerSize.width);
                    self.onColumnsChange.notify();
                }

                updateCacheRange(point, size, outerSize);

                self.onDataChangeStop.notify({
                    rows: rowsCache,
                    columns: columnsCache,
                });
            }
        }

        /*
        Cache range
        */
        function updateCacheRange(point, size, outerSize) {
            if (columnsCache.length && rowsCache.length) {
                cachedRange = {
                    minTop: rowsCache[0].calcHeight < size.height
                        ? rowsCache[0].calcHeight - rowsCache[0].height - outerSize.height
                        : rowsCache[0].calcHeight + size.height,
                    maxTop: rowsCache[(rowsCache.length - 1)].calcHeight < size.height
                        ? size.height
                        : rowsCache[(rowsCache.length - 1)].calcHeight - size.height + settings.scrollbarDimensions.height,
                    minLeft: columnsCache[0].calcWidth < size.width
                        ? columnsCache[0].calcWidth - columnsCache[0].width - outerSize.width
                        : columnsCache[0].calcWidth + size.width,
                    maxLeft: columnsCache[(columnsCache.length - 1)].calcWidth < size.width
                        ? size.width
                        : columnsCache[(columnsCache.length - 1)].calcWidth - size.width + settings.scrollbarDimensions.width,
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

        init();

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "resetCacheRange": resetCacheRange,
            "requestDataFromRange": requestDataFromRange,

            "rows": rows,
            "columns": columns,

            "getRowsHeight": getRowsHeight,
            "getColumnsWidth": getColumnsWidth,

            "getRowByIndex": getRowByIndex,
            "getColumnByIndex": getColumnByIndex,
            "getRowById": getRowById,
            "getColumnById": getColumnById,

            "getRowIndexById": getRowIndexById,
            "getColumnIndexById": getColumnIndexById,

            "setFilter": setFilter,
            "clearFilter": clearFilter,
            "clearFilters": clearFilters,

            "onRowsChange": new SmallGrid.Event.Handler(),//rename to onRowCountChange
            "onColumnsChange": new SmallGrid.Event.Handler(),//rename to onColumnCountChange
            "onDataChange": new SmallGrid.Event.Handler(),
            "onDataChangeStart": new SmallGrid.Event.Handler(),
            "onDataChangeStop": new SmallGrid.Event.Handler(),
        });
    }
})(jQuery);