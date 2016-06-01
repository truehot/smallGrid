(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Cell": {
                "Editor": {
                    "Create": CreateEditor,
                    "Checkbox": CheckboxEditor,
                    "Float": FloatEditor,
                    "Integer": IntegerEditor,
                    "Text": TextEditor,
                    "Select": SelectEditor,
                },
            }
        }
    });

    function CheckboxEditor(options, settings) {
        var self = this,
            value = !options.value;

        this.destroy = function () {
            return self;
        };

        this.getValue = function () {
            self.onChange.notify({
                "value": value
            });
            return value;
        };

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": options.value
        });
    }

    function FloatEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-float-editor" />').val(value).width(options.column.width);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return self;
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            if ($element.is(':focus') === false) {
                $element.val(self.getValue()).select();
            }
            return self;
        };

        function convertValue(value) {
            return parseFloat(value, 10) || 0;
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function IntegerEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-integer-editor" />').val(value).width(options.column.width);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return self;
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            if ($element.is(':focus') === false) {
                $element.val(self.getValue()).select();
            }
            return self;
        };

        function convertValue(value) {
            return parseInt(value, 10) || 0;
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function TextEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-text-editor"/>').val(value).width(options.column.width);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return self;
        };

        this.getValue = function () {
            return $element.val();
        };

        this.setValue = function (value) {
            $element.val(value);
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            if ($element.is(':focus') === false) {
                $element.val(self.getValue()).select();
            }
            return self;
        };


        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }


    function SelectEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<select class="grid-select-editor"/>').val(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return self;
        };

        this.getValue = function () {
            return $element.val();
        };

        this.setValue = function (value) {
            $element.val(value);
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            $element.focus();
            return self;
        };

        self.setSource = function (values) {
            if (values.constructor === Array) {
                $.each(values, function (index, item) {
                    $element.append(new Option(item.text, item.value));
                });
            }
            $element.val(value);
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function CreateEditor(name, options, settings) {
        if (!name.length) {
            throw new TypeError("Editor name is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        if (SmallGrid.Utils.isFunction(name, SmallGrid.Cell.Editor) === false) {
            throw new TypeError("name is not defined");
        }

        return new SmallGrid.Cell.Editor[name](options, settings);
    }

})(jQuery);