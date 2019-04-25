var GraphFileReader = require("./GraphFileReader.js");
var SparseGraph = require("./SparseGraph.js");
var SimpleNode = require("./SimpleNode.js");
var GraphEdge = require("./GraphEdge.js");

var reader = new GraphFileReader();
var graph = reader.createFromFile(__dirname + "/data/cities.json",SparseGraph,SimpleNode,GraphEdge);

console.dir(graph);

var search;
var searchOut; // path to destination
var searchBack; // path from destination (to complete roundtrip)
var pathToOut;
var pathToBack;
var pathReadable;
var answer;

var GraphSearchDjikstra = require("./GraphSearchDjikstra.js");

search = new GraphSearchDjikstra();
//
// this line will give the path starting from Nashville (19) to Madison (1)
searchOut = search.execute(graph,19,1);
// this line gives the return path
searchBack = search.execute(graph,1,19);
//
pathToOut = searchOut.getPathToTarget();
pathToBack = searchBack.getPathToTarget();
pathReadable = [];

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
var daysOfTrip = 4;
var hoursDriving = 8;

var drivingSpeed = 70; // this can either be arbitrary or user can adjust it idk
answer = search.canIMakeIt(graph, pathToOut, pathToBack, daysOfTrip, hoursDriving, drivingSpeed);

console.log("Djikstra\n");
if (answer[0] == "True") {
	console.log("Your timing for the trip works. Have fun on the trip!");
	console.log("You should take the path:"+pathReadable);
}
else {
	console.log("You will not make it with the constraints. We suggest driving at least "+answer[1]+" hours per day if you're trying to make it in "+answer[2]+" days");
}
