# SmallGrid
SmallGrid(beta) is javascript component for displaying tabular data.

## Demo

> [Demo link](http://truehot.github.io/smallGrid/).

## Requires

- jQuery >= 2.1.4
- Font awesome >=4.3.0

## Browser Support

Microsoft Edge ✔ 
Chrome 47.0+   ✔ 
Firefox 43.0+  ✔

## Installation

Include necessary JS and CSS files

<!-- -->

    <link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="styles.all.css" type="text/css" />
    <script src="libs/jquery-2.1.4.min.js"></script>
    <script src="small.grid.all.min.js"></script>

## Usage

Example code:

        $(document).ready(function () {
            var columns = [
		{ 'name': "Name", 'field': "task1", 'width': 100 },
            ];
            var items = [
		{ "task1": "Eric", "task2": "Ball", "task3": "Tallinn", "task4": "1232", "task5": "1111111" },
            ];
            var grid = new SmallGrid.Grid.Create($('.small-grid'), items, columns);
        });

## Tests
[![Build Status](https://travis-ci.org/truehot/smallGrid.svg?branch=master)](https://travis-ci.org/truehot/smallGrid)
From the project directory, in folder tests can be ran using index.html

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## Contact

For questions about smallGrid, you can write me smallgridinfo@gmail.com or open an issue

## License

[MIT License](https://github.com/truehot/smallGrid/blob/master/LICENSE.txt)