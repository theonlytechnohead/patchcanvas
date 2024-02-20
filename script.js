paper.install(window);

var canvas = document.getElementById('canvas');
var paperScope = new paper.PaperScope();

// Set up the canvas
window.onload = function () {
	paper.setup('canvas')
	paperScope.setup(canvas);
	// Set initial view center
	var center = new paperScope.Point(paperScope.view.viewSize.width / 2, paperScope.view.viewSize.height / 2);
	paperScope.view.center = center;

	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);

	// Variables to store view interaction data
	var zoomFactor = 1;
	var minZoom = 0.5;
	var maxZoom = 5;
	var initialTouchDistance;
	var isDragging = false;
	var startInput, lastInput;

	// Function to handle input start (mousedown or touchstart)
	function handleInputStart(event) {
		event.preventDefault();
		isDragging = true;
		startInput = event.touches ? event.touches[0] : event;

		// zooming
		if (event.touches && event.touches.length >= 2) {
			// Calculate the initial distance between two touches
			var touch1 = new paperScope.Point(event.touches[0].clientX, event.touches[0].clientY);
			var touch2 = new paperScope.Point(event.touches[1].clientX, event.touches[1].clientY);
			initialTouchDistance = touch1.getDistance(touch2);
		}
	}

	function handleInputMove(event) {
		event.preventDefault();
		if (isDragging) {
			lastInput = event.touches ? event.touches[0] : event;
			// Calculate the delta between start and current input positions
			var deltaX = (lastInput.pageX - startInput.pageX) / paperScope.view.zoom;
			var deltaY = (lastInput.pageY - startInput.pageY) / paperScope.view.zoom;
			// Adjust the view center based on the delta
			paperScope.view.center = paperScope.view.center.subtract(new paperScope.Point(deltaX, deltaY));
			// Update startInput for the next iteration
			startInput = lastInput;
		}

		// zooming
		if (event.touches && event.touches.length >= 2) {
			// Calculate the distance between two touches
			var touch1 = new paperScope.Point(event.touches[0].clientX, event.touches[0].clientY);
			var touch2 = new paperScope.Point(event.touches[1].clientX, event.touches[1].clientY);
			var touchDistance = touch1.getDistance(touch2);
			// Adjust the zoom factor based on the touch distance
			var newZoomFactor = touchDistance / initialTouchDistance;
			// Limit the zoom factor to a reasonable range
			newZoomFactor = Math.max(minZoom, Math.min(newZoomFactor, maxZoom));
			// Calculate the new view center to zoom towards the center of the touches
			// var newViewCenter = touch1.add(touch2).multiply(0.5);
			// Update the view center and zoom factor
			// paperScope.view.center = newViewCenter;
			paperScope.view.zoom = newZoomFactor;
		}
	}

	function handleInputEnd(event) {
		event.preventDefault();
		isDragging = false;
	}

	// Event listeners for touch events
	canvas.addEventListener('touchstart', handleInputStart, false);
	canvas.addEventListener('touchmove', handleInputMove, false);
	canvas.addEventListener('touchend', handleInputEnd, false);

	// Event listeners for mouse events
	canvas.addEventListener('mousedown', handleInputStart, false);
	canvas.addEventListener('mousemove', handleInputMove, false);
	canvas.addEventListener('mouseup', handleInputEnd, false);

	// Event listener for scroll-based zoom
	canvas.addEventListener('wheel', function (event) {
		event.preventDefault(); // Prevent the default scrolling behavior
		// Adjust the zoom factor based on the scroll delta
		zoomFactor *= Math.exp(-event.deltaY * 0.001);
		// Limit the zoom factor to a reasonable range
		zoomFactor = Math.max(minZoom, Math.min(zoomFactor, maxZoom));
		// Apply the zoom to the Paper.js view
		paperScope.view.zoom = zoomFactor;
	});

	var circle = new Path.Circle(new Point(100, 100), 10);
	circle.fillColor = 'red';

	// Don't forget to call paper.view.draw() to update the canvas
	paperScope.view.draw();

	circle.onClick = function (event) {
		circle.fillColor = 'blue';
	};

};

function drawBorder() {
	if (!rectangle) {
		var rectangle = new paperScope.Path.Rectangle({
			point: new paperScope.Point(1, 1),
			size: new paperScope.Size(paperScope.view.viewSize.width - 2, paperScope.view.viewSize.height - 2),
			strokeColor: 'red',
			strokeWidth: 2
		})
	}
}

function drawGrid() {
	var gridSize = 20; // Adjust the grid size as needed

	// Draw horizontal lines
	for (var y = 0; y < paperScope.view.viewSize.height; y += gridSize) {
		var from = new paperScope.Point(0, y);
		var to = new paperScope.Point(paperScope.view.viewSize.width - 1, y);
		var line = new paperScope.Path.Line(from, to);
		line.strokeColor = 'rgba(0, 0, 0, 0.1)';
	}

	// Draw vertical lines
	for (var x = 0; x < paperScope.view.viewSize.width; x += gridSize) {
		var from = new paperScope.Point(x, 0);
		var to = new paperScope.Point(x, paperScope.view.viewSize.height - 1);
		var line = new paperScope.Path.Line(from, to);
		line.strokeColor = 'rgba(0, 0, 0, 0.1)';
	}
	drawBorder();
}

function resizeCanvas() {
	canvas.width = window.innerWidth - 2;
	canvas.height = window.innerHeight - 2;
	console.log('Window width:', window.innerWidth);
	console.log('Window height:', window.innerHeight);
	console.log('Canvas width:', canvas.width);
	console.log('Canvas height:', canvas.height);

	paperScope.view.viewSize = new paperScope.Size(window.innerWidth, window.innerHeight);

	console.log('Paper:', paperScope.view.viewSize);
	drawGrid();
}