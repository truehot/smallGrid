"use strict";

(function ($) {
    $.extend(true, window, {
        "SmallGrid": {
            "Cell": {
                "Editor": {
                    "Create": CreateEditor,
                    "Checkbox": CheckboxEditor,
                    "Float": FloatEditor,
                    "Integer": IntegerEditor,
                    "None": NoneEditor,
                    "Text": TextEditor,
                },
            }
        }
    });

    function CheckboxEditor(options) {
        var self = this,
            value = options.value,
            $element = $('<input type="checkbox" class="grid-checkbox-editor" />').val(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return this;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return this;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return this;
        };

        this.getValue = function () {
            return convertValue($element.prop('checked'));
        };

        this.setValue = function (value) {
            $element.prop('checked', convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return this;
        };

        this.focus = function () {
            $element.val(self.getValue()).focus();
            return this;
        };

        function convertValue(value) {
            return (/^true$/i).test(value);
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

    function FloatEditor(options) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-float-editor" />').val(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return this;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return this;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return this;
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return this;
        };

        this.focus = function () {
            $element.val(self.getValue()).select();

            return this;
        };

        function convertValue(value) {
            return parseFloat(value, 10) || 0;
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

    function IntegerEditor(options) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-integer-editor" />').val(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return this;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return this;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return this;
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return this;
        };

        this.focus = function () {
            $element.val(self.getValue()).select();

            return this;
        };

        function convertValue(value) {
            return parseInt(value, 10) || 0;
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

    function NoneEditor(options) {
        var self = this,
            value = options.value,
            $element = $("<span class='grid-none-editor' />").text(value);
        
        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return this;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return this;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return this;
        };

        this.getValue = function () {
            return convertValue($element.text());
        };

        this.setValue = function (value) {
            
            $element.text(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return this;
        };

        this.focus = function () {
            $element.select();
            return this;
        };

        function convertValue(value) {
            return value;
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

    function TextEditor(options) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-text-editor"/>').val(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return this;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return this;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return this;
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return this;
        };

        this.focus = function () {
            $element.val(self.getValue()).select();
            return this;
        };

        function convertValue(value) {
            return value;
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

    function CreateEditor(name, options, settings) {
        if (settings.Utils.isFunction(name, settings.RowEditor) == true) {
            return new settings.RowEditor[name](options);
        }
    }

})(jQuery);