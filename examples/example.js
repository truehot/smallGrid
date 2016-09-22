$(document).ready(function () {
    var menus = ["Basic configuration", "Sortable columns plugin", "Filterable columns plugin", "Background of columns/rows/cells", "Resizeable columns plugin", "Random rows height and columns width", "Cell editors plugin", "100 000 rows", "Columns alignment plugin", "Row selection plugin", "Few on the same page", "Add/update/delete rows", "Column picker plugin", "Column checkbox plugin"];
    var ul = $('<ul class="menu"/>');
    var activeFile = document.location.href.match(/[^\/]+$/)[0];

    for (var i = 0; i < menus.length; i++) {
        var file = 'example' + (i + 1) + '.html';
        var cssClass = (file==activeFile) ? 'class="active"':"";
        ul.append($('<li><a href="' + file + '" '+cssClass+'>' + menus[i] + '</a></li>'))
    }
    ul.prependTo(document.body);
})