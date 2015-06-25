"use strict";

(function ($) {

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "Filter": FilterMenuPlugin,
                "FilterMenu": FilterMenu,
            }
        }
    });

    function FilterMenu(column, $container, settings) {
        var self = this;
        var $element = $("<div class='grid-header-menu'></div>").hide();
        var filter = new settings.Filter.FilterQuery(column.field, settings);

        /*
        Init && destroy
        */
        function init() {
            var $form = $('<form>').appendTo($element);
            var $content = $('<div class="grid-header-menucontent"></div>')
                .append('<select name="type1"><option value="contains">Contains</option><option value="doesnotcontain">Does not contains</option><option value="eq">Is equal to</option><option value="neq">Is not equal to</option><option value="startswith">Starts with</option><option value="endswith">Ends with</option></select>')
                .append('<input type="text" name="value1" value=""/>')
                .append('<select name="operator"><option value="and">And</option><option value="or">Or</option></select>')
                .append('<select name="type2"><option value="contains">Contains</option><option value="doesnotcontain">Does not contains</option><option value="eq">Is equal to</option><option value="neq">Is not equal to</option><option value="startswith">Starts with</option><option value="endswith">Ends with</option></select>')
                .append('<input type="text" name="value2" value=""/>')
                .append('<input type="submit" name="Filter" value="Filter" class="btn btn-primary"/>')
                .append('<input type="reset" name="Clear" value="Clear" class="btn"/>')
                .appendTo($form);

            $element.on("click", handleMenuClick);
            $form.on("submit", handleMenuSubmit);
            $form.on("reset", handleMenuClear);


            $element.appendTo($container);

            return this;
        }

        function destroy() {
            $element.remove();
        }

        /*
        Menu functions
        */
        function setupMenu($target) {
            var containerSizes = {
                width: $container.width(),
                left: $container.offset().left
            }

            var elementSizes = {
                width: $element.width(),
                height: $element.height()
            }

            var targetSizes = {
                left: $target.offset().left,
                top: $target.offset().top,
                width: $target.width(),
                height: $target.height(),
            }

            var left = (elementSizes.width + targetSizes.left > containerSizes.width && elementSizes.width < targetSizes.left - containerSizes.left)
                            ? targetSizes.left + targetSizes.width - elementSizes.width
                            : targetSizes.left;

            $element.offset({
                top: targetSizes.top + targetSizes.height,
                left: left
            });

            return this;
        }

        function show() {
            $element.show();
            return this;
        }

        function hide() {
            $element.hide();
            return this;
        }

        function getFormValues() {
            return {
                "value": [$element.find("input[name='value1']").val(), $element.find("input[name='value2']").val()],
                "type": [$element.find("select[name='type1']").val(), $element.find("select[name='type2']").val()],
                "operator": $element.find("select[name='operator']").val()
            }
        }

        function getId() {
            return column.id;
        }

        function getFilter() {
            return filter;
        }

        /*
        Menu handlers
        */
        function handleMenuSubmit(e) {
            e.preventDefault();
            var formValues = getFormValues();

            filter.clear();
            filter.add(formValues.type[0], formValues.value[0]);
            if (formValues.value[1]) {
                filter.add(formValues.operator);
                filter.add(formValues.type[1], formValues.value[1]);
            }

            self.onSubmit.notify();

            hide();
        }

        function handleMenuClear(e) {
            e.preventDefault();
            self.onClear.notify({});
            hide();
        }

        function handleMenuClick(e) {
            e.stopPropagation();
        }


        $.extend(this, {
            "onSubmit": new SmallGrid.Event.Handler(),
            "onClear": new SmallGrid.Event.Handler(),

            "init": init,
            "destroy": destroy,

            "getFilter": getFilter,

            "getId": getId,
            "hide": hide,
            "setupMenu": setupMenu,
            "show": show,
        });
    }

    function FilterMenuPlugin(viewModel, view, settings) {
        var self = this;
        var cache = [];
        var activeId = 0;

        function init() {
            view.onBeforeRowsRendered.subscribe(handleHideMenu);
            view.onBodyClick.subscribe(handleHideMenu);
            view.onColumnResizeStart.subscribe(handleHideMenu);
            view.onHeaderClick.subscribe(handleHeaderClick);
            view.onScrollStart.subscribe(handleHideMenu);
        }

        function destroy() {
            view.onBeforeRowsRendered.unsubscribe(handleHideMenu);
            view.onBodyClick.unsubscribe(handleHideMenu);
            view.onColumnResizeStart.unsubscribe(handleHideMenu);
            view.onHeaderClick.unsubscribe(handleHeaderClick);
            view.onScrollStart.unsubscribe(handleHideMenu);

            for (var i = 0; i < cache.length; i++) {
                var menu = cache[i];
                menu.onSubmit.unsubscribe(handleMenuSubmit);
                menu.onClear.unsubscribe(handleMenuClear);
                menu.destroy();
            }
            cache = [];
        }

        /*
        Grid handlers
        */
        function handleHeaderClick(e) {
            if (e && e.type && e.type == "filter") {
                e.event.stopPropagation();

                if (!isMenu(e.column.id)) {
                    var menu = new FilterMenu(e.column, view.getContainerNode(), settings)
                        .init()
                        .show()
                        .setupMenu($(e.event.target));
                    menu.onSubmit.subscribe(handleMenuSubmit);
                    menu.onClear.subscribe(handleMenuClear);

                    cache.push(menu);
                }

                if (activeId !== e.column.id) {
                    hideActiveMenu();
                    showMenuById(e.column.id);
                } else {
                    if (activeId) {
                        hideActiveMenu();
                    } else {
                        showMenuById(e.column.id);
                    }
                }
            }
        }

        function handleHideMenu(e) {
            if (activeId) {
                hideActiveMenu();
            }
        }

        /*
        Menu handlers
        */
        function handleMenuSubmit(e) {
            if (activeId) {
                for (var i = 0; i < cache.length; i++) {
                    if (cache[i].getId() == activeId) {
                        viewModel.setFilter(cache[i].getFilter());
                        break;
                    }
                }
                hideActiveMenu();
            }
        }

        function handleMenuClear(e) {
            if (activeId) {
                for (var i = 0; i < cache.length; i++) {
                    if (cache[i].getId() == activeId) {
                        viewModel.clearFilter(cache[i].getFilter());
                        break;
                    }
                }
                hideActiveMenu();
            }
        }

        /*
        Menu functions
        */
        function isMenu(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].getId() == id) {
                    return true;
                }
            }
            return false;
        }

        function getMenu(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].getId() == id) {
                    return cache[i];
                }
            }
        }

        function showMenuById(id) {
            var menu = getMenu(id);
            if (menu) {
                menu.show();
                activeId = id;
            }
        }

        function hideActiveMenu() {
            var menu = getMenu(activeId);
            if (menu) {
                menu.hide();
                activeId = 0;
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });

        init();
    }

})(jQuery);