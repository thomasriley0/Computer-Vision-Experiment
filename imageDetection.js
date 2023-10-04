var canvas = document.getElementById("screen");
var img = document.getElementById("clientImg")


var cv = require('./js/src/opencv.js');
var maxPoint;

setInterval(async function () { 

    playerCoords = getPlayerCoords()
	if (playerCoords[1] + 40 <= 640) {
		playerCoords[1] += 40
	}
    var dataURL = canvas.toDataURL("image/png");
    img.src = dataURL
    await sleep(100)


	// Read the images from the specified image id
	let source = cv.imread('mapImg');
	let source2= cv.imread('mapImg');
	let template = cv.imread('clientImg');


	//crop the screen 150 pixels left, 240 pixels down, 440 width, 200 height
	let rect = new cv.Rect(150, 240, 440, 200);
	let resized = new cv.Mat();
	resized = template.roi(rect);

	let templateMask1 = new cv.Mat();
	let templateMask2 = new cv.Mat();
	let templateMask3 = new cv.Mat();

	let templateMask = new cv.Mat(); 



	//create ranges for brown pixels
	const lower1 = [87, 46, 71, 255];
	const upper1 = [89, 48, 73, 255];

	const lower2 = [64,49,33, 255];
	const upper2 = [66,51,35, 255];

	const lower3 = [78,60,41, 255];
	const upper3 = [81,62,43, 255];

	//create mats containing brown pixels 
	const low1 = new cv.Mat(resized.rows, resized.cols, resized.type(), lower1);
	const high1 = new cv.Mat(resized.rows, resized.cols, resized.type(), upper1);

	const low2 = new cv.Mat(resized.rows, resized.cols, resized.type(), lower2);
	const high2 = new cv.Mat(resized.rows, resized.cols, resized.type(), upper2);

	const low3 = new cv.Mat(resized.rows, resized.cols, resized.type(), lower3);
	const high3 = new cv.Mat(resized.rows, resized.cols, resized.type(), upper3);


	//mask out any color that isn't a brown cave pixel
	cv.inRange(resized, low1, high1, templateMask1);
	cv.inRange(resized, low2, high2, templateMask2);
	cv.inRange(resized, low3, high3, templateMask3);

	cv.bitwise_xor(templateMask1, templateMask2, templateMask) 
	cv.bitwise_xor(templateMask, templateMask3, templateMask) 


	cv.cvtColor(source, source, cv.COLOR_RGB2GRAY, 0);
	
	cv.Canny(source, source, 0, 1, 3, false);

	cv.cvtColor(resized, resized, cv.COLOR_RGB2GRAY, 0);
	cv.bitwise_and(resized, templateMask, resized)
	cv.Canny(resized, resized, 0, 1, 3, false);

	
	let dst = new cv.Mat();
	let mask = new cv.Mat();
	
	// Use the matchTemplate method to match the images
	cv.matchTemplate(source, resized, dst, cv.TM_CCOEFF , mask);

	// Use the minMaxLoc method to get the best match
	let result = cv.minMaxLoc(dst, mask);
	console.log(result)
	maxPoint = result.maxLoc;

	//edit coordinates to match crop region
	maxPoint["y"] = maxPoint["y"] - 240;
	maxPoint["x"] = maxPoint["x"] - 150;

	let color = new cv.Scalar(255, 0, 0, 255);
    let color2 = new cv.Scalar(0, 128, 0, 255);
	let point = new cv.Point(maxPoint.x  + resized.cols + 220, maxPoint.y  + resized.rows + 280);
    let playerPoint = new cv.Point(maxPoint.x + playerCoords[0], maxPoint.y + playerCoords[1]);
    let playerPoint2 = new cv.Point(maxPoint.x + playerCoords[0] + 20, maxPoint.y + playerCoords[1] + 60);
	$(".coordinateText").eq(0).text("Player Coordinates: x : " + Math.ceil(maxPoint.x + playerCoords[0]) + " y : " + Math.ceil(maxPoint.y + playerCoords[1]));
	cv.rectangle(source2, maxPoint, point, color, 4, cv.LINE_8, 0);
	cv.rectangle(source2, playerPoint2, playerPoint, color2, 5, cv.LINE_8, 0);
	//cv.imshow('sourceCanvas', source2);
	cv.imshow('sourceCanvas', source2);

	source.delete(); 
	source2.delete(); 
	template.delete(); 
	dst.delete();
	mask.delete();


},2000 )

