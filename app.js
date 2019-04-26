var city_coords = [
									[43.038902, -87.90647], // Milwaukee
									[43.07319, -89.4012], // Madison
									[41.878113, -87.6298], // Chicago
									[41.676353, -86.25199], // South Bend
									[42.33143, -83.04575], // Detroit
									[41.663937, -83.555214], // Toledo
									[39.961174, -82.998795], // Columbus
									[40.440624, -79.99589], // Pittsburgh
									[43.096214, -79.037735], // Niagara Falls
									[42.36008, -71.05888], // Boston
									[40.712784, -74.00594], // New York
									[39.364285, -74.42293], // Atlantic City
									[39.290386, -76.61219], // Baltimore
									[32.776474, -79.93105], // Charleston
									[30.332184, -81.65565], // Jacksonville
									[28.538336, -81.379234], // Orlando
									[25.76168, -80.19179], // Miami
									[27.950575, -82.45718], // Tampa
									[33.748997, -84.387985], // Atlanta
									[36.162663, -86.7816], // Nashville
									[38.252666, -85.75845], // Louisville
									[39.10312, -84.51202], // Cincinnati
									[39.768402, -86.158066], // Indianapolis
									[38.627003, -90.1994], // St. Louis
									[35.149536, -90.04898], // Memphis
									[29.951065, -90.07153], // New Orleans
									[29.760427, -95.369804], // Houston
									[30.267153, -97.74306], // Austin
									[31.777576, -106.44246], // El Paso
									[32.221745, -110.926476], // Tucson
									[32.715736, -117.16109], // San Diego
									[34.052235, -118.24368], // Los Angeles
									[37.338207, -121.88633], // San Jose
									[37.77493, -122.41942], // San Francisco
									[38.581573, -121.4944], // Sacramento
									[45.523064, -122.67648], // Portland
									[47.60621, -122.33207], // Seattle
									[61.218056, -149.90028], // Anchorage
									[36.16994, -115.13983], // Las Vegas
									[40.76078, -111.891045], // Salt Lake City
									[33.448376, -112.074036], // Phoenix
									[39.739235, -104.99025], // Denver
									[35.085335, -106.60555], // Albuquerque
									[39.11405, -94.627464], // Kansas City
									[41.252365, -95.997986], // Omaha
									[41.600544, -93.60911], // Des Moines
									[41.66113, -91.53017], // Iowa City
									[44.977753, -93.26501], // Minneapolis
									[43.8791, -103.4591], // Mount Rushmore
									[44.428, -110.5885], // Yellowstone
									[35.4676, -97.5164], // Oklahoma City
									[36.0544, -112.1401] // Grand Canyon
];

var _ = require("underscore");
var GraphFileReader = require("./GraphFileReader.js");
var SparseGraph = require("./SparseGraph.js");
var SimpleNode = require("./SimpleNode.js");
var GraphEdge = require("./GraphEdge.js");
var GraphSearchDjikstra = require("./GraphSearchDjikstra.js");

var reader = new GraphFileReader();
var graph = reader.createFromFile(__dirname + "/data/cities.json",SparseGraph,SimpleNode,GraphEdge);

function doStuff(start_point, end_point, daysOfTrip_, hoursDriving_){
//function doTheStuff() {
		//var reader = new GraphFileReader();
		//var graph = reader.createFromFile(__dirname + "/data/cities.json",SparseGraph,SimpleNode,GraphEdge);


		var search;
		var searchOut; // path to destination
		var searchBack; // path from destination (to complete roundtrip)
		var pathToOut;
		var pathToBack;
		var pathReadable;
		var answer;

		//var GraphSearchDjikstra = require("./GraphSearchDjikstra.js");

		search = new GraphSearchDjikstra();
		//
		// this line will give the path starting from Nashville (19) to Madison (1)
		searchOut = search.execute(graph,start_point,end_point);
		// this line gives the return path
		searchBack = search.execute(graph,end_point,start_point);
		//
		pathToOut = searchOut.getPathToTarget();
		pathToBack = searchBack.getPathToTarget();
		pathReadable = [];
		console.log("pathToOut: "+pathToOut);

		// creates the readable path for the first half
		pathToOut.forEach(function(nodeIndex)
		{
			pathReadable.push((" "+graph.getNode(nodeIndex).label));
		})

		// just so the end node on the first half isn't repeated
		if (pathReadable[pathReadable.length-1] == (" "+graph.getNode(pathToBack[0]).label)) {
			pathReadable.pop();
		}

		// creates the readable path for the second half
		pathToBack.forEach(function(nodeIndex)
		{
			pathReadable.push((" "+graph.getNode(nodeIndex).label));
		})

		//
		// these will be user entered constraints
		//
		var daysOfTrip = daysOfTrip_;
		var hoursDriving = hoursDriving_;

		var drivingSpeed = 70; // this can either be arbitrary or user can adjust it idk
		answer = search.canIMakeIt(graph, pathToOut, pathToBack, daysOfTrip, hoursDriving, drivingSpeed);

		console.log("Djikstra\n");
		if (answer[0] == "Good") {
			console.log("Your timing for the trip works! Have fun on the trip!");
			console.log("You should take the path:"+pathReadable);
		}
		else {
			console.log("You will not make it with the current constraints.");
			console.log("We suggest \n\t1. Driving at least "+answer[1]+" hours per day if you're trying to make it in "+answer[2]+" days driving at "+drivingSpeed+" mph");
			console.log("\t2. Extending the trip to at least "+answer[3]+" days to drive "+answer[4]+" hours per day driving at "+drivingSpeed+" mph");
			console.log("Using one of the above constraints, your path will be: "+pathReadable);
		}

		var out_path = [];
		for (var i = 0; i < pathToOut.length; i++){
			out_path.push({
				lat: city_coords[pathToOut[i]][0],
				lng: city_coords[pathToOut[i]][1]
			});
		}
		out_path.push({
			lat: city_coords[end_point][0],
			lng: city_coords[end_point][1]
		});
		var back_path = [];
		for (var i = 0; i < pathToBack.length; i++){
			back_path.push({
				lat: city_coords[pathToBack[i]][0],
				lng: city_coords[pathToBack[i]][1]
			});
		}
		back_path.push({
			lat: city_coords[start_point][0],
			lng: city_coords[start_point][1]
		});

		var path = out_path;
		for (var i = 0; i < back_path.length; i++){
			path.push(back_path[i]);
		}

		//return path;
	}

//var newApp = new App();
doStuff(19, 1, 4, 8);
