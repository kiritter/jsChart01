(function(){

init();

function init() {
	window.addEventListener("load", function(){

		var dataset = createDataset();
		drawLineChart(dataset);

	}, false);
}

//--------------------------------------------------
function createDataset() {
	var DATA_LENGTH = 20;
	var dataset = [];
	var obj;
	for (var i = 0; i < DATA_LENGTH; i++) {
		obj = {};
		obj.date = "201307" + pad_zero(i+1) + " 080000";
		obj.data = math_round(Math.random() + 1, 4);
		dataset.push(obj);
	}
	return dataset;
}

function pad_zero(num) {
	return ("0" + num).slice(-2);
}

function math_round(num, newScale) {
	var s = Math.pow(10, newScale);
	num = num * s;
	num = Math.round(num);
	return num / s;
}

//--------------------------------------------------
function drawLineChart(dataset) {
	LineChart.drawLineChart("#stageSVG", dataset);
}

//--------------------------------------------------

})();
