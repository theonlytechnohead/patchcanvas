// Initialize Paper.js
paper.install(window);

// Set up the canvas
window.onload = function () {
	paper.setup('myCanvas'); // 'myCanvas' should match the ID of your canvas element
	// Your Paper.js code goes here

	// Inside the window.onload function
	var circle = new Path.Circle(new Point(100, 100), 50);
	circle.fillColor = 'red';

	// Don't forget to call paper.view.draw() to update the canvas
	paper.view.draw();

	circle.onClick = function (event) {
		circle.fillColor = 'blue';
	};

};
