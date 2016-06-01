$(document).ready(function () {
    var menus = ["Basic configuration", "Sortable columns", "Filterable columns", "Background of columns/rows/cells", "Resizeable columns", "Random rows height and columns width", "Cell editors", "100 000 rows", "Columns alignment", "Row selection", "Few on the same page", "Add/update/delete rows", "Column picker plugin"];
    var ul = $('<ul class="menu"/>');
    var activeFile = document.location.href.match(/[^\/]+$/)[0];

    for (var i = 0; i < menus.length; i++) {
        var file = 'example' + (i + 1) + '.html';
        var cssClass = (file==activeFile) ? 'class="active"':"";
        ul.append($('<li><a href="' + file + '" '+cssClass+'>' + menus[i] + '</a></li>'))
    }
    ul.prependTo(document.body);
})