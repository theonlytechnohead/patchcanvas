var gridSize = 20;
var group = new Group();

function draw() {
	for (var y = 0; y < view.viewSize.height; y += gridSize) {
		var from = new Point(0, y);
		var to = new Point(view.viewSize.width - 1, y);
		var line = new Path.Line(from, to);
		line.strokeColor = 'rgba(0, 0, 0, 0.1)';
		group.addChild(line);
	}

	for (var x = 0; x < view.viewSize.width; x += gridSize) {
		var from = new Point(x, 0);
		var to = new Point(x, view.viewSize.height - 1);
		var line = new Path.Line(from, to);
		line.strokeColor = 'rgba(0, 0, 0, 0.1)';
		group.addChild(line);
	}
}
draw();

function resize(event) {
	group.removeChildren();
	draw();
}

view.on('resize', resize);