var path = new Path.Circle({
	center: view.center,
	radius: 30,
	fillColor: 'red'
});

// http://paperjs.org/reference/item/#on-type-function
path.on('mousedown', function () {
	this.fillColor.hue = Math.random() * 360;
})

function resize(event) {
	path.position = view.center;
}

view.on('resize', resize);