var LineChart = function() {
	"use strict";

	var convDateFromString = function(dataset) {
		var parseDate = d3.time.format("%Y%m%d %H%M%S").parse;

		dataset.forEach(function(d) {
			d.date = parseDate(d.date);
		});
	};

	var calcScaleX = function(MIN_DATA_X, MAX_DATA_X, WIDTH, PADDING) {
		var scaleX = d3.time.scale()
			.domain([MIN_DATA_X, MAX_DATA_X])
			.range([PADDING.left, WIDTH - PADDING.right]);
		return scaleX;
	};
	var calcScaleY = function(MIN_Y, MAX_Y, HEIGHT, PADDING) {
		var scaleY = d3.scale.linear()
			.domain([MIN_Y, MAX_Y])
			.range([HEIGHT - PADDING.bottom, PADDING.top]);
		return scaleY;
	};

	var createElementSVG = function(elementId, WIDTH, HEIGHT) {
		var svg = d3.select(elementId)
			.append("svg")
			.attr("width", WIDTH)
			.attr("height", HEIGHT);
		return svg;
	};

	var drawAxis = function(svg, scaleX, scaleY, HEIGHT, PADDING) {
		var xAxis = d3.svg.axis()
			.scale(scaleX)
			.orient("bottom")
			.ticks(0);

		var yAxis = d3.svg.axis()
			.scale(scaleY)
			.orient("left")
			.ticks(10);

		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + (HEIGHT - PADDING.bottom) + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + PADDING.left + ",0)")
			.call(yAxis);
	};

	var drawPathData = function(svg, dataset, scaleX, scaleY) {
		var line = 
		d3.svg.line()
			.x(function(d) {
				return scaleX(d.date);
			})
			.y(function(d) {
				return scaleY(d.data);
			});
		svg.append("path")
			.datum(dataset)
			.attr("class", "line")
			.attr("d", line);
	};

	var drawPointData = function(svg, dataset, scaleX, scaleY) {
		svg.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
			.attr("cx", function(d) {
				return scaleX(d.date);
			})
			.attr("cy", function(d) {
				return scaleY(d.data);
			})
			.attr("r", 5);
	};

	var drawLabelData = function(svg, dataset, scaleX, scaleY) {
		svg.selectAll("text.labelData")
			.data(dataset)
			.enter()
			.append("text")
			.attr("class", "labelData")
			.text(function(d) {
				return d.data;
			})
			.attr("x", function(d) {
				return scaleX(d.date) + 10;
			})
			.attr("y", function(d) {
				return scaleY(d.data);
			});
	};

	var drawLabelAxisX = function(svg, dataset, scaleX, scaleY, MIN_Y) {
		var labels = 
		svg.selectAll("text.labelAxisX")
			.data(dataset)
			.enter()
			.append("text")
			.attr("class", "labelAxisX")
			.attr("x", function(d) {
				return scaleX(d.date);
			})
			.attr("y", function(d) {
				return scaleY(MIN_Y - 0.05);
			})
			.attr("text-anchor", "middle");

		labels.each(function(d, i) {
			if (i % 2 === 0) {
				return "";
			}
			var el = d3.select(this);
			var format = d3.time.format("%m/%d %H:%M");
			var strDate = format(d.date);
			var splits = strDate.split(" ");

			var tspan;
			tspan = el.append("tspan").text(splits[0]);
			tspan.attr("x", el.attr("x")).attr("dy", 0);
			tspan = el.append("tspan").text(splits[1]);
			tspan.attr("x", el.attr("x")).attr("dy", 10);
		});

		labels.each(function(d, i) {
			if (i % 2 === 0) {
				return "";
			}
			var el = d3.select(this);
			svg.append("line")
				.attr("class", "axisYSub")
				.attr("x1", scaleX(d.date))
				.attr("y1", scaleY(d.data))
				.attr("x2", scaleX(d.date))
				.attr("y2", scaleY(MIN_Y));
		});
	};

	var drawLineData = function(svg, data, scaleX, scaleY, MIN_DATA_X, MAX_DATA_X) {
		svg.append("line")
			.attr("class", "CL")
			.attr("x1", scaleX(MIN_DATA_X))
			.attr("y1", scaleY(data))
			.attr("x2", scaleX(MAX_DATA_X))
			.attr("y2", scaleY(data));
	};

	//--------------------------------------------------------------------------------
	var drawLineChart = function(elementId, dataset) {

		var MARGIN = {top: 0, right: 20, bottom: 0, left: 0};
		var PADDING = {top: 20, right: 40, bottom: 50, left: 30};

		var WIDTH = 640 - (MARGIN.left + MARGIN.right);
		var HEIGHT = 380 - (MARGIN.top + MARGIN.bottom);

		convDateFromString(dataset);

		var MIN_DATA_X = d3.min(dataset, function(d) {return d.date;});
		var MAX_DATA_X = d3.max(dataset, function(d) {return d.date;});
		var MIN_DATA_Y = d3.min(dataset, function(d) {return d.data;});
		var MAX_DATA_Y = d3.max(dataset, function(d) {return d.data;});
		var pad_y = (MAX_DATA_Y - MIN_DATA_Y) * 0.2;
		var MIN_Y = MIN_DATA_Y - pad_y;
		var MAX_Y = MAX_DATA_Y + pad_y;

		var scaleX = calcScaleX(MIN_DATA_X, MAX_DATA_X, WIDTH, PADDING);
		var scaleY = calcScaleY(MIN_Y, MAX_Y, HEIGHT, PADDING);

		var svg = createElementSVG(elementId, WIDTH, HEIGHT);

		drawAxis(svg, scaleX, scaleY, HEIGHT, PADDING);

		drawLabelAxisX(svg, dataset, scaleX, scaleY, MIN_Y);

		drawPathData(svg, dataset, scaleX, scaleY);

		drawLineData(svg, 1.5, scaleX, scaleY, MIN_DATA_X, MAX_DATA_X);

		drawPointData(svg, dataset, scaleX, scaleY);

		drawLabelData(svg, dataset, scaleX, scaleY);

	};

	//--------------------------------------------------------------------------------
	return {
		drawLineChart: function(id, dataset) {
			drawLineChart(id, dataset);
		}
	};

}();
